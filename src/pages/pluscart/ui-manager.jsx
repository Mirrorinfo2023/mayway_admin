import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUiConfig,
  toggleSectionVisibility,
  updateFlashSaleTimer,
  selectUiConfig,
  selectUiStatus,
  selectFlashSaleTimer,
  selectSpecialOffers,
} from '../../redux/slices/plusCartSlice';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Loader2, Timer, BarChart2, Gift, Layout, 
  Layers, Eye, EyeOff, Settings2, ArrowUpCircle 
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const UiManager = () => {
  const dispatch = useDispatch();
  const uiConfig = useSelector(selectUiConfig);
  const status = useSelector(selectUiStatus);
  const flashSaleTimer = useSelector(selectFlashSaleTimer);
  const specialOffers = useSelector(selectSpecialOffers);
  const [timerDays, setTimerDays] = useState(flashSaleTimer?.days || 3);
  const [selectedSection, setSelectedSection] = useState(null);

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Section Views',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4
      },
      {
        label: 'User Engagement',
        data: [45, 70, 65, 75, 42, 65, 55],
        fill: true,
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Section Performance Analytics',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  useEffect(() => {
    dispatch(fetchUiConfig());
  }, [dispatch]);

  useEffect(() => {
    if (flashSaleTimer?.days) {
      setTimerDays(flashSaleTimer.days);
    }
  }, [flashSaleTimer]);

  const handleToggleVisibility = (sectionId, currentState) => {
    dispatch(toggleSectionVisibility({
      sectionId,
      isEnabled: !currentState
    }));
  };

  const handleUpdateTimer = () => {
    dispatch(updateFlashSaleTimer(Number(timerDays)));
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-gray-600">Loading UI Configuration...</p>
        </div>
      </div>
    );
  }

  const getSectionIcon = (sectionId) => {
    switch (sectionId) {
      case 'specialOffers':
        return <Gift className="h-5 w-5 text-purple-600" />;
      case 'flashSale':
        return <Timer className="h-5 w-5 text-orange-600" />;
      case 'categories':
        return <Layers className="h-5 w-5 text-blue-600" />;
      default:
        return <Settings2 className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Layout className="h-10 w-10" />
              UI Manager
            </h1>
            <p className="text-indigo-100 mt-2 text-lg">
              Customize and manage your application sections
            </p>
          </div>
          <Button 
            onClick={() => dispatch(fetchUiConfig())}
            className="bg-white text-indigo-600 hover:bg-indigo-50"
          >
            Reset Configuration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart2 className="h-6 w-6 text-indigo-600" />
              Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {uiConfig.sections.map((section) => (
          <Card 
            key={section.id}
            className={`shadow-md ${
              selectedSection === section.id ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => setSelectedSection(section.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50 rounded-t-lg p-6">
              <div className="flex items-center gap-3">
                {getSectionIcon(section.id)}
                <div>
                  <CardTitle className="text-xl font-bold">
                    {section.name}
                  </CardTitle>
                  {section.id === 'specialOffers' && (
                    <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {specialOffers.length} Active Offers
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6">
                {section.id === 'flashSale' && (
                  <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-lg">
                    <Timer className="h-4 w-4 text-orange-600" />
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      value={timerDays}
                      onChange={(e) => setTimerDays(e.target.value)}
                      className="w-20 bg-white"
                    />
                    <span className="text-sm text-orange-600">days</span>
                    <Button 
                      size="sm"
                      onClick={handleUpdateTimer}
                      disabled={timerDays === flashSaleTimer?.days}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Update
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                    section.isEnabled 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <Switch
                      id={`enable-${section.id}`}
                      checked={section.isEnabled}
                      onCheckedChange={() => handleToggleVisibility(section.id, section.isEnabled)}
                      className={`${
                        section.isEnabled
                          ? 'data-[state=checked]:bg-green-600'
                          : 'data-[state=unchecked]:bg-red-600'
                      }`}
                    />
                    <div className="flex items-center gap-2">
                      {section.isEnabled ? (
                        <>
                          <Eye className="h-4 w-4" />
                          <span className="text-sm font-semibold">
                            Visible
                          </span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4" />
                          <span className="text-sm font-semibold">
                            Hidden
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <ArrowUpCircle className="h-4 w-4" />
                    Display Order: {section.order || 'Default'}
                  </span>
                  <span className="text-indigo-600 font-medium">
                    ID: {section.id}
                  </span>
                </div>
                {section.id === 'specialOffers' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {specialOffers.map(offer => (
                      <div 
                        key={offer.id} 
                        className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 rounded-lg text-white"
                      >
                        <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                        <p className="text-purple-100 mb-4">{offer.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold bg-white/20 px-3 py-1 rounded-lg">
                            {offer.discount}% OFF
                          </span>
                          {/* <span className="text-sm bg-white/10 px-3 py-1 rounded-lg">
                            Until {new Date(offer.validUntil).toLocaleDateString()}
                          </span> */}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UiManager; 