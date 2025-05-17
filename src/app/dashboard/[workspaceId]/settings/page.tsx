'use client';

import { enableFirstView, getFirstView } from '@/actions/user';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  params: {
    workspaceId: string;
  };
};

const SettingsPage = ({ params }: Props) => {
  const [firstView, setFirstView] = useState<undefined | boolean>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getFirstView();
      if (response.status === 200) setFirstView(response?.data);
    };
    fetchData();
  }, [firstView]);

  const switchState = async (checked: boolean) => {
    const view = await enableFirstView(checked);
    if (view) {
      toast(view.status === 200 ? 'Success' : 'Failed', {
        description: view.data,
      });
    }
  };

  return (
    <div className="p-6 bg-[#252525] rounded-lg shadow-md max-w-lg">
      {/* Header Section */}
      <h2 className="text-3xl font-extrabold text-white mb-4">
        Video Sharing Settings
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Enabling this feature will send you notifications when someone watches
        your video for the first time. This feature can help during client
        outreach.
      </p>

      {/* Enable First View Section */}
      <Label className="flex items-center justify-between">
        <span className="text-lg font-medium text-gray-200">
          Enable First View
        </span>
        <Switch
          onCheckedChange={switchState}
          disabled={firstView === undefined}
          checked={firstView}
          onClick={() => setFirstView(!firstView)}
          className={`${
            firstView
              ? 'bg-[#00a87e] '
              : 'bg-gray-600 hover:bg-gray-500'
          } transition-all duration-200`}
        >
          <span
            className={`absolute left-1 h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
              firstView ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </Switch>
      </Label>
    </div>
  );
};

export default SettingsPage;