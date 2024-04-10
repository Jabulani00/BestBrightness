import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

// Define an interface for the data structure
interface InventoryItem {
  category: string;
  quantity: number;
  name: string;
}

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {
  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.generateQuantityByCategoryChart();
    this.generateQuantityByCategory();
  }

  generateQuantityByCategoryChart() {
    this.firestore
      .collection('inventory')
      .valueChanges()
      .pipe(
        map((data: unknown[]) => {
          return data.map((item: any) => {
            return {
              category: item.category,
              quantity: item.quantity,
              name: item.name,
            } as InventoryItem;
          });
        })
      )
      .subscribe((data: InventoryItem[]) => {
        const categories = data.map((item) => item.name);
        const uniqueCategories = Array.from(new Set(categories));
        const quantitiesByCategory = uniqueCategories.map((name) => {
          const categoryItems = data.filter((item) => item.name === name);
          const totalQuantity = categoryItems.reduce((acc, curr) => acc + curr.quantity, 0);
          return totalQuantity;
        });

        const lowQuantityThreshold = 10; // Set the low quantity threshold
        const lowQuantityCategories = uniqueCategories.filter((category, index) => {
          return quantitiesByCategory[index] < lowQuantityThreshold;
        });

        const ctx = document.getElementById('quantityByCategoryChart') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: uniqueCategories,
            datasets: [
              {
                label: 'Quantity',
                data: quantitiesByCategory,
                backgroundColor: (context) => {
                  const index = context.dataIndex;
                  const category = uniqueCategories[index];
                  return lowQuantityCategories.includes(category)
                    ? 'rgba(255, 99, 132, 0.2)' // Red color for low quantity
                    : 'rgba(75, 192, 192, 0.2)'; // Default color
                },
                borderColor: (context) => {
                  const index = context.dataIndex;
                  const category = uniqueCategories[index];
                  return lowQuantityCategories.includes(category)
                    ? 'rgba(255, 99, 132, 1)' // Red color for low quantity
                    : 'rgba(75, 192, 192, 1)'; // Default color
                },
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
  }


  generateQuantityByCategory(){
    this.firestore
      .collection('storeroomInventory')
      .valueChanges()
      .pipe(
        map((data: unknown[]) => {
          return data.map((item: any) => {
            return {
              category: item.category,
              quantity: item.quantity,
              name: item.name,
            } as InventoryItem;
          });
        })
      )
      .subscribe((data: InventoryItem[]) => {
        const categories = data.map((item) => item.name);
        const uniqueCategories = Array.from(new Set(categories));
        const quantitiesByCategory = uniqueCategories.map((name) => {
          const categoryItems = data.filter((item) => item.name === name);
          const totalQuantity = categoryItems.reduce((acc, curr) => acc + curr.quantity, 0);
          return totalQuantity;
        });

        const lowQuantityThreshold = 10; // Set the low quantity threshold
        const lowQuantityCategories = uniqueCategories.filter((category, index) => {
          return quantitiesByCategory[index] < lowQuantityThreshold;
        });

        const ctx = document.getElementById('quantityByCategoryStorommChart') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: uniqueCategories,
            datasets: [
              {
                label: 'Quantity',
                data: quantitiesByCategory,
                backgroundColor: (context) => {
                  const index = context.dataIndex;
                  const category = uniqueCategories[index];
                  return lowQuantityCategories.includes(category)
                    ? 'rgba(255, 99, 132, 0.2)' // Red color for low quantity
                    : 'rgba(75, 192, 192, 0.2)'; // Default color
                },
                borderColor: (context) => {
                  const index = context.dataIndex;
                  const category = uniqueCategories[index];
                  return lowQuantityCategories.includes(category)
                    ? 'rgba(255, 99, 132, 1)' // Red color for low quantity
                    : 'rgba(75, 192, 192, 1)'; // Default color
                },
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
  }
}