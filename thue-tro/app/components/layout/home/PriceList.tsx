import Card from "app/components/common/Card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export default function PriceList() {
    return (
        <div>
            <Card radius="L">
                <div className="p-4">
                    <div>
                        <h2 className="text-md font-medium">
                            Xem theo bảng giá
                        </h2>
                        <ul className="grid grid-cols-2 gap-x-8 gap-y-3 mt-2">
                            <li className="flex items-center text-sm text-blue-800 font-normal cursor-pointer">
                                <ChevronRight size={14} color="#fd7e14" />
                                Dưới 1 triệu
                            </li>
                            <li className="flex items-center text-sm text-blue-800 font-normal cursor-pointer">
                                <ChevronRight size={14} color="#fd7e14" />
                                Từ 1 - 2 triệu
                            </li>
                            <li className="flex items-center text-sm text-blue-800 font-normal cursor-pointer">
                                <ChevronRight size={14} color="#fd7e14" />
                                Từ 2 - 3 triệu
                            </li>
                            <li className="flex items-center text-sm text-blue-800 font-normal cursor-pointer">
                                <ChevronRight size={14} color="#fd7e14" />
                                Từ 3 - 5 triệu
                            </li>
                            <li className="flex items-center text-sm text-blue-800 font-normal cursor-pointer">
                                <ChevronRight size={14} color="#fd7e14" />
                                Từ 5 - 7 triệu
                            </li>
                            <li className="flex items-center text-sm text-blue-800 font-normal cursor-pointer">
                                <ChevronRight size={14} color="#fd7e14" />
                                Từ 7 - 10 triệu
                            </li>
                            <li className="flex items-center text-sm text-blue-800 font-normal cursor-pointer">
                                <ChevronRight size={14} color="#fd7e14" />
                                Từ 10 - 15 triệu
                            </li>
                            <li className="flex items-center text-sm text-blue-800 font-normal cursor-pointer">
                                <ChevronRight size={14} color="#fd7e14" />
                                Trên 15 triệu
                            </li>
                        </ul>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-md font-medium">
                            Xem theo diện tích
                        </h2>
                        <ul className="grid grid-cols-2 gap-x-8 gap-y-3 mt-2">
                            <li className="flex items-center text-sm text-blue-800 font-normal cursor-pointer">
                                <ChevronRight size={14} color="#fd7e14" />
                                Dưới 20 m
                            </li>
                            <li className="flex items-center text-sm text-blue-800 font-normal cursor-pointer">
                                <ChevronRight size={14} color="#fd7e14" />
                                Từ 20 - 30m
                            </li>
                            <li className="flex items-center text-sm text-blue-800 font-normal cursor-pointer">
                                <ChevronRight size={14} color="#fd7e14" />
                                Từ 30 - 50m
                            </li>
                            <li className="flex items-center text-sm text-blue-800 font-normal cursor-pointer">
                                <ChevronRight size={14} color="#fd7e14" />
                                Từ 50 - 70m
                            </li>
                            <li className="flex items-center text-sm text-blue-800 font-normal cursor-pointer">
                                <ChevronRight size={14} color="#fd7e14" />
                                Từ 70 - 90m
                            </li>
                            <li className="flex items-center text-sm text-blue-800 font-normal cursor-pointer">
                                <ChevronRight size={14} color="#fd7e14" />
                               Trên 90m
                            </li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
}
