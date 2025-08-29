import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ModelStats = () => {
  // Model performance data
  const overallMetrics = {
    accuracy: 0.9725,
    precision: 0.9729,
    recall: 0.9725,
    f1Score: 0.9726
  };

  const classificationData = [
    { class: 'Meningioma', precision: 0.93, recall: 0.97, f1Score: 0.95, support: 306, color: 'bg-blue-500' },
    { class: 'Glioma', precision: 0.98, recall: 0.94, f1Score: 0.96, support: 300, color: 'bg-green-500' },
    { class: 'No Tumor', precision: 0.99, recall: 0.99, f1Score: 0.99, support: 405, color: 'bg-purple-500' },
    { class: 'Pituitary', precision: 0.98, recall: 0.98, f1Score: 0.98, support: 300, color: 'bg-orange-500' }
  ];

  const totalSupport = 1311;

  // Helper function to convert decimal to percentage
  const toPercent = (value: number) => (value * 100).toFixed(1);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Brain Tumor Classification Model Performance
        </h2>
        <p className="text-gray-600 text-lg">
          Comprehensive evaluation metrics from {totalSupport.toLocaleString()} test samples
        </p>
      </div>

      {/* Overall Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Overall Accuracy', value: overallMetrics.accuracy, icon: '🎯', color: 'border-blue-500' },
          { label: 'Weighted Precision', value: overallMetrics.precision, icon: '🔍', color: 'border-green-500' },
          { label: 'Weighted Recall', value: overallMetrics.recall, icon: '📊', color: 'border-purple-500' },
          { label: 'Weighted F1-Score', value: overallMetrics.f1Score, icon: '⚖️', color: 'border-orange-500' }
        ].map((metric, index) => (
          <Card key={index} className={`border-t-4 ${metric.color} hover:shadow-lg transition-shadow`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{metric.icon}</span>
                <span className="text-3xl font-bold text-gray-900">
                  {toPercent(metric.value)}%
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700">{metric.label}</p>
              <Progress value={metric.value * 100} className="mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Classification Report */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            📋 Detailed Classification Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Class</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Precision</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Recall</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">F1-Score</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Support</th>
                </tr>
              </thead>
              <tbody>
                {classificationData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${row.color}`}></div>
                        <span className="font-medium text-gray-900">{row.class}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-gray-900">{toPercent(row.precision)}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${row.color}`}
                            style={{ width: `${row.precision * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-gray-900">{toPercent(row.recall)}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${row.color}`}
                            style={{ width: `${row.recall * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-gray-900">{toPercent(row.f1Score)}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${row.color}`}
                            style={{ width: `${row.f1Score * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-gray-700">{row.support.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Performance by Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classificationData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{item.class}</span>
                    <span className="text-sm text-gray-600">{toPercent(item.f1Score)}% F1</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">Precision</div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${item.color} opacity-60`}
                          style={{ width: `${item.precision * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">Recall</div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${item.color} opacity-80`}
                          style={{ width: `${item.recall * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">F1-Score</div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${item.color}`}
                          style={{ width: `${item.f1Score * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Model Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Model Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Key Highlights */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Key Highlights</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      <span className="font-semibold">97.25%</span> overall accuracy
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      Best performance on <span className="font-semibold">No Tumor</span> class (99% F1)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      Balanced performance across all tumor types
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      Tested on <span className="font-semibold">{totalSupport.toLocaleString()}</span> samples
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModelStats;