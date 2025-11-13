
import { v4 as uuidv4 } from 'uuid';
import { CleanDataset } from './types';

// Generate random date in the past few years
const randomDate = () => {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Random company names
const companies = [
  'Acme Corp', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella Corp',
  'Stark Industries', 'Wayne Enterprises', 'Cyberdyne Systems', 'Massive Dynamic',
  'Tyrell Corp', 'Weyland-Yutani', 'Oscorp', 'LexCorp', 'Cyberdyne Systems'
];

// Random products
const products = [
  'Widget', 'Gadget', 'Doohickey', 'Gizmo', 'Thingamabob',
  'Whatchamacallit', 'Doodad', 'Contraption', 'Apparatus', 'Device'
];

// Generate random sales data
const generateSalesData = (count: number) => {
  const data = [];
  
  for (let i = 0; i < count; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 100) + 1;
    const unitPrice = parseFloat((Math.random() * 1000 + 10).toFixed(2));
    
    // Add some data quality issues for cleaning
    const date = i % 10 === 0 ? 'invalid date' : randomDate().toISOString();
    
    // Some null values
    const salesRep = i % 7 === 0 ? null : `sales-rep-${Math.floor(Math.random() * 10) + 1}`;
    
    // Some inconsistent formatting
    let region;
    if (i % 5 === 0) {
      region = ['North', 'SOUTH', 'east', 'West', 'Central'][Math.floor(Math.random() * 5)];
    } else {
      region = ['North', 'South', 'East', 'West', 'Central'][Math.floor(Math.random() * 5)];
    }
    
    // Some currency issues
    const currency = i % 8 === 0 ? 'EUR' : 'USD';
    const totalAmount = currency === 'EUR' 
      ? parseFloat((unitPrice * quantity * 0.91).toFixed(2))
      : parseFloat((unitPrice * quantity).toFixed(2));
    
    data.push({
      id: uuidv4(),
      date,
      company,
      product,
      quantity,
      unitPrice,
      totalAmount,
      currency,
      salesRep,
      region,
      status: Math.random() > 0.8 ? 'Returned' : 'Completed'
    });
  }
  
  return data;
};

const salesData = generateSalesData(50);

export const mockDataset: CleanDataset = {
  id: 'sales-dataset',
  name: 'Sales Data',
  columns: [
    {
      id: 'id',
      name: 'ID',
      type: 'string',
      data: salesData.map(item => item.id)
    },
    {
      id: 'date',
      name: 'Date',
      type: 'date',
      data: salesData.map(item => item.date)
    },
    {
      id: 'company',
      name: 'Company',
      type: 'string',
      data: salesData.map(item => item.company)
    },
    {
      id: 'product',
      name: 'Product',
      type: 'string',
      data: salesData.map(item => item.product)
    },
    {
      id: 'quantity',
      name: 'Quantity',
      type: 'number',
      data: salesData.map(item => item.quantity)
    },
    {
      id: 'unitPrice',
      name: 'Unit Price',
      type: 'currency',
      data: salesData.map(item => item.unitPrice)
    },
    {
      id: 'totalAmount',
      name: 'Total Amount',
      type: 'currency',
      data: salesData.map(item => item.totalAmount)
    },
    {
      id: 'currency',
      name: 'Currency',
      type: 'string',
      data: salesData.map(item => item.currency)
    },
    {
      id: 'salesRep',
      name: 'Sales Rep',
      type: 'string',
      data: salesData.map(item => item.salesRep)
    },
    {
      id: 'region',
      name: 'Region',
      type: 'string',
      data: salesData.map(item => item.region)
    },
    {
      id: 'status',
      name: 'Status',
      type: 'string',
      data: salesData.map(item => item.status)
    }
  ]
};
