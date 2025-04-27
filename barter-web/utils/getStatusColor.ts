export default function getStatusColor(status: "PENDING" | "ACCEPTED" | "REJECTED") {
    switch (status) {
      case "PENDING":
        return "text-gray-500";
      case "ACCEPTED":
        return "text-green-600";
      case "REJECTED":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  }
  