import Button from "app/components/common/Button";
import Modal from "app/components/common/Modal";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    description?: string;
    itemName?: string;
    loading?: boolean;
}

export default function DeleteConfirmModal({
    open,
    onClose,
    onConfirm,
    description = "Bạn có chắc chắn muốn xóa dữ liệu này không?",
    itemName,
    loading = false,
}: DeleteConfirmModalProps) {
    return (
        <Modal
            title="Xác nhận"
            open={open}
            onClose={onClose}
            size="sm"
            footer={
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="w-auto border border-neutral-200 bg-white px-5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
                    >
                        Hủy
                    </Button>

                    <Button
                        type="button"
                        onClick={onConfirm}
                        loading={loading}
                        className="w-auto bg-red-500 px-5 hover:bg-red-600"
                    >
                        Xóa
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                {/* CONTENT */}
                <div className="flex items-center gap-3">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-red-50">
                        <Trash2 className="size-5 text-red-500" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-800">
                            Vui lòng xác nhận thao tác của bạn
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                            Thao tác này sẽ xóa dữ liệu khỏi hệ thống.
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                    <p className="text-sm leading-6 text-neutral-600">
                        {description}
                    </p>

                    {itemName && (
                        <p className="mt-2 break-words text-sm font-semibold text-neutral-800">
                            {itemName}
                        </p>
                    )}
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-500" />

                    <p className="text-xs leading-5 text-red-600">
                        Dữ liệu sau khi xóa có thể không khôi phục được. Vui
                        lòng kiểm tra kỹ trước khi tiếp tục.
                    </p>
                </div>
            </div>
        </Modal>
    );
}
