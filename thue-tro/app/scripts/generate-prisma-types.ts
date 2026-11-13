
import {
    readFileSync,
    writeFileSync,
    existsSync,
    mkdirSync,
} from 'node:fs';

import path from 'node:path';

// ============================================
// CONFIGURATION
// ============================================

const ROOT = process.cwd();

const SCHEMA_PATH = path.join(
    ROOT,
    'prisma',
    'schema.prisma',
);

// Có thể truyền đường dẫn frontend bằng --out
const OUTPUT_PATH = (() => {
    const index = process.argv.indexOf('--out');

    if (index !== -1 && process.argv[index + 1]) {
        return path.resolve(ROOT, process.argv[index + 1]);
    }

    return path.resolve(
        ROOT,
        '../thue-tro-frontend/src/types/prisma-models.ts',
    );
})();

// ============================================
// TYPES
// ============================================

interface PrismaField {
    name: string;
    type: string;
    isList: boolean;
    isOptional: boolean;
    isRelation: boolean;
    isEnum: boolean;
    isIgnored: boolean;
}

interface PrismaModel {
    name: string;
    fields: PrismaField[];
    isIgnored: boolean;
}

interface PrismaEnum {
    name: string;
    values: string[];
}

// ============================================
// REMOVE COMMENTS
// ============================================

function removeComments(schema: string): string {
    return schema
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '')
        .replace(/^\s*\/\/\/.*$/gm, '');
}

// ============================================
// PARSE ENUMS
// ============================================

function parseEnums(schema: string): PrismaEnum[] {
    const enums: PrismaEnum[] = [];

    const regex = /\benum\s+(\w+)\s*\{([\s\S]*?)\}/g;

    let match: RegExpExecArray | null;

    while ((match = regex.exec(schema)) !== null) {
        const name = match[1];
        const body = match[2];

        const values = body
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => {
                return (
                    line.length > 0 &&
                    !line.startsWith('@') &&
                    /^[a-zA-Z_]\w*/.test(line)
                );
            })
            .map((line) => {
                return line.match(/^([a-zA-Z_]\w*)/)?.[1] ?? '';
            })
            .filter(Boolean);

        enums.push({ name, values });
    }

    return enums;
}

// ============================================
// PARSE MODELS
// ============================================

function parseModels(schema: string): PrismaModel[] {
    const models: PrismaModel[] = [];

    const modelRegex = /\bmodel\s+(\w+)\s*\{([\s\S]*?)\}/g;

    const modelNames = new Set<string>();
    const enumNames = new Set(
        parseEnums(schema).map((item) => item.name),
    );

    let match: RegExpExecArray | null;

    while ((match = modelRegex.exec(schema)) !== null) {
        modelNames.add(match[1]);
    }

    modelRegex.lastIndex = 0;

    while ((match = modelRegex.exec(schema)) !== null) {
        const name = match[1];
        const body = match[2];

        const fields: PrismaField[] = [];

        for (const line of body.split('\n')) {
            const trimmed = line.trim();

            if (
                !trimmed ||
                trimmed.startsWith('@') ||
                trimmed.startsWith('//')
            ) {
                continue;
            }

            const fieldMatch = trimmed.match(
                /^(\w+)\s+([\w]+)(\[\])?(\?)?\s*(.*)$/,
            );

            if (!fieldMatch) continue;

            const [
                ,
                fieldName,
                type,
                list,
                optional,
                attributes,
            ] = fieldMatch;

            const isIgnored = /@ignore\b/.test(attributes);

            if (isIgnored) continue;

            const isRelation = modelNames.has(type);
            const isEnum = enumNames.has(type);

            fields.push({
                name: fieldName,
                type,
                isList: Boolean(list),
                isOptional: Boolean(optional),
                isRelation,
                isEnum,
                isIgnored,
            });
        }

        models.push({
            name,
            fields,
            isIgnored: /@@ignore\b/.test(body),
        });
    }

    return models.filter((model) => !model.isIgnored);
}

// ============================================
// PRISMA TYPE -> TYPESCRIPT TYPE
// ============================================

function getScalarType(type: string): string {
    const types: Record<string, string> = {
        String: 'string',
        Int: 'number',
        Float: 'number',
        Boolean: 'boolean',

        // JSON API serialization
        DateTime: 'string',
        BigInt: 'string',
        Decimal: 'string',
        Bytes: 'string',

        // JSON value
        Json: 'JsonValue',
    };

    return types[type] ?? 'unknown';
}

// ============================================
// GENERATE FIELD TYPE
// ============================================

function getFieldType(field: PrismaField): string {
    let type: string;

    if (field.isRelation || field.isEnum) {
        type = field.type;
    } else {
        type = getScalarType(field.type);
    }

    if (field.isList) {
        return `${type}[]`;
    }

    if (field.isOptional) {
        type += ' | null';
    }

    return type;
}

// ============================================
// GENERATE ENUM
// ============================================

function generateEnum(item: PrismaEnum): string {
    const values = item.values
        .map((value) => `  | '${value}'`)
        .join('\n');

    return `export type ${item.name} =
${values};
`;
}

// ============================================
// GENERATE MODEL
// ============================================

function generateModel(model: PrismaModel): string {
    const fields = model.fields
        .map((field) => {
            const optional =
                field.isRelation || field.isIgnored
                    ? '?'
                    : '';

            const type = getFieldType(field);

            return `  ${field.name}${optional}: ${type};`;
        })
        .join('\n');

    return `export interface ${model.name} {
${fields}
}`;
}

// ============================================
// GENERATE FILE
// ============================================

function generateFile(
    models: PrismaModel[],
    enums: PrismaEnum[],
): string {
    const header = `/**
 * AUTO GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 *
 * Source: prisma/schema.prisma
 * Generated by: scripts/generate-prisma-types.ts
 */

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

`;

    const enumContent = enums
        .map(generateEnum)
        .join('\n');

    const modelContent = models
        .map(generateModel)
        .join('\n\n');

    return [
        header,
        '// ============================================',
        '// ENUMS',
        '// ============================================',
        enumContent,
        '// ============================================',
        '// MODELS',
        '// ============================================',
        modelContent,
        '',
    ].join('\n');
}

// ============================================
// MAIN
// ============================================

async function main() {
    console.log('\n================================');
    console.log('  PRISMA TYPES GENERATOR');
    console.log('================================\n');

    if (!existsSync(SCHEMA_PATH)) {
        throw new Error(
            `Cannot find Prisma schema: ${SCHEMA_PATH}`,
        );
    }

    const schema = readFileSync(SCHEMA_PATH, 'utf8');

    const cleanSchema = removeComments(schema);

    const enums = parseEnums(cleanSchema);
    const models = parseModels(cleanSchema);

    console.log(`Found ${models.length} models.`);
    console.log(`Found ${enums.length} enums.\n`);

    if (models.length === 0) {
        throw new Error('No Prisma models found.');
    }

    const output = generateFile(models, enums);

    const outputDir = path.dirname(OUTPUT_PATH);

    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
    }

    writeFileSync(OUTPUT_PATH, output, 'utf8');

    console.log('[SUCCESS] Types generated!');
    console.log(`Output: ${OUTPUT_PATH}`);

    console.log('\nGenerated models:');

    for (const model of models) {
        console.log(`  - ${model.name}`);
    }

    console.log('\nGenerated enums:');

    for (const item of enums) {
        console.log(`  - ${item.name}`);
    }

    console.log('\nGeneration completed!\n');
}

main().catch((error) => {
    console.error('\nGenerator failed:', error);
    process.exitCode = 1;
});
