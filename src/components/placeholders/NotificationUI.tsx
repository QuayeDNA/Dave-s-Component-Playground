import { Bell, AlertCircle, CheckCircle2, Info, X, MessageSquare, Download, Calendar, Battery, Shield } from 'lucide-react';

interface Notifications {
    type: string;
    message: string;
    icon: JSX.Element;
    action: string;
    progress?: number;
    time?: string;
    level?: string;
    id?: string;
}

const ModernNotification = (notification : Notifications) => (
  <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between shadow-lg border border-blue-200/20">
    <div className="flex items-center gap-3">
      <div className="text-blue-500">{notification.icon}</div>
      <p className="text-gray-800 font-medium">{notification.message}</p>
    </div>
    <div className="flex items-center gap-2">
      <button className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-blue-600 transition-colors">
        {notification.action}
      </button>
      <button className="text-gray-400 hover:text-gray-600">
        <X className="h-5 w-5" />
      </button>
    </div>
  </div>
);

const MinimalNotification = ( notification : Notifications) => (
  <div className="bg-white rounded-md p-3 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2">
      <div className="text-green-500">{notification.icon}</div>
      <p className="text-gray-700">{notification.message}</p>
    </div>
    <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
      {notification.action}
    </button>
  </div>
);

const ExpandedNotification = (notification : Notifications) => (
  <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
    <div className="flex items-start gap-3">
      <div className="text-orange-500 mt-1">{notification.icon}</div>
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{notification.message}</p>
        <div className="mt-2 flex gap-2">
          <button className="bg-orange-500 text-white px-4 py-1.5 rounded text-sm hover:bg-orange-600">
            {notification.action}
          </button>
          <button className="text-gray-600 px-4 py-1.5 rounded text-sm hover:bg-gray-100">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CompactNotification = (notification : Notifications) => (
  <div className="bg-gray-800 text-white rounded-full py-2 px-4 flex items-center gap-3 shadow-lg">
    <div className="text-blue-400">{notification.icon}</div>
    <p className="text-sm">{notification.message}</p>
    <button className="text-blue-400 text-sm font-medium hover:text-blue-300 ml-2">
      {notification.action}
    </button>
  </div>
);

// New notification components...
const FloatingNotification = (notification : Notifications) => (
  <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow transform hover:-translate-y-1">
    <div className="flex items-center gap-3 mb-2">
      <div className="bg-purple-100 p-2 rounded-full">
        <div className="text-purple-600">{notification.icon}</div>
      </div>
      <p className="text-gray-800 font-medium">{notification.message}</p>
    </div>
    <div className="ml-11">
      <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
        {notification.action} →
      </button>
    </div>
  </div>
);

const ProgressNotification = (notification : Notifications) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <div className="flex items-center gap-3 mb-3">
      <div className="text-blue-600">{notification.icon}</div>
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{notification.message}</p>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${notification.progress}%` }}
          />
        </div>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{notification.progress}% complete</span>
      <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
        {notification.action}
      </button>
    </div>
  </div>
);

const CalendarNotification = (notification : Notifications) => (
  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg p-4">
    <div className="flex items-start gap-3">
      <div className="bg-white/20 p-2 rounded">
        <div className="text-white">{notification.icon}</div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="font-medium">{notification.message}</p>
          <span className="text-sm bg-white/20 px-2 py-1 rounded">{notification.time}</span>
        </div>
        <button className="mt-2 bg-white/20 hover:bg-white/30 text-sm px-4 py-1.5 rounded-full transition-colors">
          {notification.action}
        </button>
      </div>
    </div>
  </div>
);

const BatteryNotification = (notification : Notifications) => (
  <div className="bg-red-50 rounded-lg p-3 border-2 border-red-200 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="text-red-500 animate-pulse">{notification.icon}</div>
      <div>
        <p className="text-gray-800 font-medium">{notification.message}</p>
        <span className="text-sm text-red-500 font-medium">{notification.level} remaining</span>
      </div>
    </div>
    <button className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm hover:bg-red-200 transition-colors">
      {notification.action}
    </button>
  </div>
);

const SecurityNotification = (notification : Notifications) => (
  <div className="bg-gradient-to-b from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
    <div className="flex items-center gap-3">
      <div className="bg-green-500 text-white p-2 rounded-full">
        {notification.icon}
      </div>
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{notification.message}</p>
        <button className="mt-2 text-green-600 text-sm font-medium hover:text-green-700 flex items-center gap-1">
          {notification.action}
          <span className="text-lg">›</span>
        </button>
      </div>
    </div>
  </div>
);

const ToastNotification = (notification: Notifications) => (
  <div className="fixed bottom-4 right-4 bg-white rounded-lg p-4 shadow-xl border-l-4 border-green-500 animate-slide-up">
    <div className="flex items-center gap-3">
      <div className="text-green-500">{notification.icon}</div>
      <p className="text-gray-800">{notification.message}</p>
    </div>
  </div>
);

const StatusNotification = (notification: Notifications) => (
  <div className="bg-gray-900 text-white rounded-md p-3 flex items-center gap-3">
    <div className="relative">
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      {notification.icon}
    </div>
    <p>{notification.message}</p>
  </div>
);

const AlertNotification = (notification: Notifications) => (
  <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200 animate-shake">
    <div className="flex items-center gap-3">
      <div className="text-red-500">{notification.icon}</div>
      <div>
        <p className="text-red-800 font-bold">{notification.message}</p>
        <p className="text-red-600 text-sm mt-1">{notification.action}</p>
      </div>
    </div>
  </div>
);

const BadgeNotification = (notification: Notifications) => (
  <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
    {notification.icon}
    <span>{notification.message}</span>
  </div>
);

const BannerNotification = (notification: Notifications) => (
  <div className="w-full bg-yellow-50 border-b border-yellow-200 p-4">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="text-yellow-500">{notification.icon}</div>
        <p className="text-yellow-800">{notification.message}</p>
      </div>
      <button className="text-yellow-600 hover:text-yellow-800">{notification.action}</button>
    </div>
  </div>
);

const NotificationVariants = () => {

  const notifications = [
    {
      id: 'update-1',
      type: 'modern',
      message: "New update available",
      icon: <Bell className="h-5 w-5"/>,
      action: "Update Now"
    },
    {
      id: 'update-2',
      type: 'minimal',
      message: "Your profile has been updated",
      icon: <CheckCircle2 className="h-5 w-5"/>,
      action: "View Changes"
    },
    {
      id: 'update-3',
      type: 'expanded',
      message: "Security alert: New login from unknown device",
      icon: <AlertCircle className="h-5 w-5"/>,
      action: "Review Activity"
    },
    {
      id: 'update-4',
      type: 'compact',
      message: "Meeting starting in 5 minutes",
      icon: <Info className="h-5 w-5"/>,
      action: "Join Now"
    },
    {
      id: 'update-5',
      type: 'floating',
      message: "3 new messages from Team Chat",
      icon: <MessageSquare className="h-5 w-5"/>,
      action: "Read Messages"
    },
    {
      id: 'update-6',
      type: 'progress',
      message: "Downloading project files...",
      icon: <Download className="h-5 w-5"/>,
      action: "View Progress",
      progress: 65
    },
    {
      id: 'update-7',
      type: 'calendar',
      message: "Team meeting with Design Department",
      icon: <Calendar className="h-5 w-5"/>,
      action: "Add to Calendar",
      time: "2:30 PM"
    },
    {
      id: 'update-8',
      type: 'battery',
      message: "Device battery is running low",
      icon: <Battery className="h-5 w-5"/>,
      action: "Power Settings",
      level: "15%"
    },
    {
      id: 'update-9',
      type: 'security',
      message: "2-Factor Authentication is now enabled",
      icon: <Shield className="h-5 w-5"/>,
      action: "Review Settings"
    },
    {
      id: 'update-11',
      type: 'toast',
      message: "Changes saved successfully",
      icon: <CheckCircle2 className="h-5 w-5"/>,
      action: "Undo"
    },
    {
      id: 'update-12',
      type: 'status',
      message: "You are currently online",
      icon: <Info className="h-5 w-5"/>,
      action: "View Status"
    },
    {
      id: 'update-13',
      type: 'alert',
      message: "Critical system error detected",
      icon: <AlertCircle className="h-5 w-5"/>,
      action: "View Details"
    },
    {
      id: 'update-14',
      type: 'badge',
      message: "New",
      icon: <Info className="h-3 w-3"/>,
      action: "View"
    },
    {
      id: 'update-15',
      type: 'banner',
      message: "Scheduled maintenance in 24 hours",
      icon: <Info className="h-5 w-5"/>,
      action: "Learn More"
    }
  ];

  return (
    <div className="space-y-4 p-4 max-w-2xl bg-white">
      {notifications.map((notification) => {
        switch (notification.type) {
          case 'modern':
            return <ModernNotification key={notification.id} {...notification} />;
          case 'minimal':
            return <MinimalNotification key={notification.id} {...notification} />;
          case 'expanded':
            return <ExpandedNotification key={notification.id} {...notification} />;
          case 'compact':
            return <CompactNotification key={notification.id} {...notification} />;
          case 'floating':
            return <FloatingNotification key={notification.id} {...notification} />;
          case 'progress':
            return <ProgressNotification key={notification.id} {...notification} />;
          case 'calendar':
            return <CalendarNotification key={notification.id} {...notification} />;
          case 'battery':
            return <BatteryNotification key={notification.id} {...notification} />;
          case 'security':
            return <SecurityNotification key={notification.id} {...notification} />;
            case 'toast':
              return <ToastNotification key={notification.id} {...notification} />;
            case 'status':
              return <StatusNotification key={notification.id} {...notification} />;
            case 'alert':
              return <AlertNotification key={notification.id} {...notification} />;
            case 'badge':
              return <BadgeNotification key={notification.id} {...notification} />;
            case 'banner':
              return <BannerNotification key={notification.id} {...notification} />; 
          default:
            return null;
        }
      })}
    </div>
  );
};

export default NotificationVariants;