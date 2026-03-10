import React from 'react';
import {PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer} from 'recharts';

export default function SpendingChart({transactions, categories}) {
    //Group transactions by categort and sum amounts
    const categorySpending = categories.map(cat => {
        const total = transactions 
            .filter(t => t.category_id === cat.id)
            .reduce((sum, t) => sum + t.amount, 0);
        return {
            name: cat.name,
            value: Math.round(total * 100) / 100 //Round to 2 decimals 
        }; 
    }).filter(item => item.value > 0); // Onlt show categories with spending


    //Theme colors matching finflow 
    const COLORS = ['#7BAE6E', '#F4A261', '#6b9c5f', '#E8985E', '#5a8b4e', '#D48A52'];

    return (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#FFFEF5', borderRadius: '12px' }}>
          <h3 style={{ color: '#3D3227', fontFamily: 'Fraunces', fontSize: '20px', marginBottom: '20px' }}>
            💰 Spending by Category
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categorySpending}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categorySpending.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
}