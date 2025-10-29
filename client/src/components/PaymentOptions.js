import React from 'react';
import { Radio, Card, Typography, Divider } from 'antd';

const { Title, Text } = Typography;

function PaymentOptions({ 
  totalAmount, 
  selectedOption, 
  onOptionChange, 
  disabled = false 
}) {
  const options = [
    {
      value: 'full',
      label: 'Pay Full Amount',
      amount: totalAmount,
      description: 'Pay the complete amount and get confirmed status',
      status: 'Confirmed'
    },
    {
      value: 'advance',
      label: 'Pay 50% Advance',
      amount: totalAmount * 0.5,
      description: 'Pay 50% advance and get booked status',
      status: 'Booked'
    }
  ];

  return (
    <Card className="w-full">
      <Title level={4} className="mb-4">Payment Options</Title>
      
      <Radio.Group
        value={selectedOption}
        onChange={(e) => onOptionChange(e.target.value)}
        disabled={disabled}
        className="w-full"
      >
        <div className="space-y-4">
          {options.map((option) => (
            <div key={option.value} className="w-full">
              <Radio value={option.value} className="w-full">
                <div className="flex justify-between items-center w-full ml-2">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.description}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      Status: {option.status}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      ${option.amount.toFixed(2)}
                    </div>
                    {option.value === 'advance' && (
                      <div className="text-xs text-gray-500">
                        Remaining: ${(totalAmount - option.amount).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </Radio>
            </div>
          ))}
        </div>
      </Radio.Group>

      <Divider className="my-4" />
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <Text strong>Total Amount:</Text>
          <Text strong className="text-lg">${totalAmount.toFixed(2)}</Text>
        </div>
        {selectedOption === 'advance' && (
          <div className="flex justify-between items-center mt-2">
            <Text>Advance Payment (50%):</Text>
            <Text className="text-green-600">${(totalAmount * 0.5).toFixed(2)}</Text>
          </div>
        )}
        {selectedOption === 'advance' && (
          <div className="flex justify-between items-center mt-1">
            <Text>Remaining Amount:</Text>
            <Text className="text-orange-600">${(totalAmount * 0.5).toFixed(2)}</Text>
          </div>
        )}
      </div>
    </Card>
  );
}

export default PaymentOptions;
