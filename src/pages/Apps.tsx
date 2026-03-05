import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const apps = [
  { title: 'Overview', path: '/overview' },
  { title: 'Zones', path: '/zones' },
  { title: 'Animations', path: '/animations/2d' },
  { title: '3D Interactive', path: '/3d-interactive' },
  { title: 'Sticky Notes', path: '/sticky-notes' },
  { title: 'Games', path: '/games' },
  { title: 'Model Redesign', path: '/model-redesign' },
];

const AppsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Applications</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <Card
            key={app.path}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-gray-800 border-gray-700"
            onClick={() => navigate(app.path)}
          >
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium text-gray-100">
                {app.title}
              </h3>
              <p className="text-sm text-gray-400 mt-2">Go to {app.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppsPage;
