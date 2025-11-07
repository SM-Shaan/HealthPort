interface StatusCardProps {
  icon: string;
  title: string;
  count: number;
  bgColor?: string;
}

const StatusCard = ({ icon, title, count, bgColor = 'bg-blue-50' }: StatusCardProps) => {
  return (
    <div className={`${bgColor} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{count}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};

export default StatusCard;
