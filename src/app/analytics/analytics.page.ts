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
  }

  generateQuantityByCategoryChart() {
    this.firestore.collection('inventory').valueChanges().pipe(
      map((data: unknown[]) => {
        
        return data.map((item: any) => {
          return {
            category: item.category,
            quantity: item.quantity,
            name: item.name,
          } as InventoryItem;
        });
      })
    ).subscribe((data: InventoryItem[]) => {
     
      const categories = data.map(item => item.category);
      const uniqueCategories = Array.from(new Set(categories));

      const quantitiesByCategory = uniqueCategories.map(category => {
        const categoryItems = data.filter(item => item.category === category);
        const totalQuantity = categoryItems.reduce((acc, curr) => acc + curr.quantity, 0);
        return totalQuantity;
      });

      const ctx = document.getElementById('quantityByCategoryChart') as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: uniqueCategories,
          datasets: [{
            label: 'Quantity',
            data: quantitiesByCategory,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }
}
