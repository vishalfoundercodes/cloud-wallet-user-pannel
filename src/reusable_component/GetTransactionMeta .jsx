import { ArrowDownLeft, ArrowUpRight, Clock, CircleCheckBig, X } from "lucide-react";
import React from 'react'


export const getTransactionMeta = (tx, isDeposit = true) => {
  let statusColor = "";
  let icon = null;
  let amountColor = "";

  // Amount type ke liye
  if (isDeposit) {
    icon = <ArrowDownLeft className="w-5 h-5 text-green-600 dark:text-green-400" />;
    amountColor = "text-green-600 dark:text-green-400";
  } else {
    icon = <ArrowUpRight className="w-5 h-5 text-blue-600 dark:text-blue-500" />;
    amountColor = "text-blue-600 dark:text-blue-500";
  }

  // Status ke liye
  if (tx.status === 0) {
    statusColor = "bg-gray-200 text-gray-700";
  } else if (tx.status === 1) {
    statusColor = "bg-gray-900 dark:bg-richblack-600 text-white";
  } else {
    statusColor = "bg-red-600 text-white";
  }

  return { statusColor, icon, amountColor };
};
