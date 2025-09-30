# Search Demo Implementation Guide

## Overview
Updated `Searchdemo.jsx` and `BikeCardDemo.jsx` to filter bikes based on availability with a toggle option.

---

## ✅ **Features Implemented**

### 1. **Availability Filtering**
- **Default**: Shows only available bikes (`isAvailable = true` AND `numberOfVehicles > 0`)
- **Toggle**: Users can switch to see all bikes (available + unavailable)

### 2. **Toggle Switch**
- Beautiful green toggle button in the header
- Shows current state: "Available Only" or "Show All"
- Responsive design for mobile and desktop

### 3. **Enhanced BikeCardDemo**
- Visual availability badge on bike image
- Shows number of vehicles in stock
- Disabled "Book Now" button for unavailable bikes
- Additional message explaining why bike is unavailable
- Hover effects and smooth transitions

---

## 📊 **How It Works**

### **Searchdemo.jsx**

```javascript
// State to control filtering
const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);

// Filter logic
const filteredBikes = showOnlyAvailable
  ? bikes.filter((bike) => bike.isAvailable && bike.numberOfVehicles > 0)
  : bikes;
```

**Filtering Rules:**
- **Available bikes**: `isAvailable === true` AND `numberOfVehicles > 0`
- **Unavailable bikes**: `isAvailable === false` OR `numberOfVehicles === 0`

### **BikeCardDemo.jsx**

```javascript
// Check availability
const isAvailable = bike.isAvailable && bike.numberOfVehicles > 0;

// Visual indicators
- Green badge: "Available" 
- Red badge: "Not Available"
- Enabled button: "Book Now"
- Disabled button: "Not Available"
```

---

## 🎨 **UI Components**

### **Toggle Button**
```jsx
<label className="flex items-center cursor-pointer">
  <div className="relative">
    <input
      type="checkbox"
      checked={showOnlyAvailable}
      onChange={(e) => setShowOnlyAvailable(e.target.checked)}
    />
    <div className="block w-14 h-8 rounded-full bg-green-500"></div>
    <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full"></div>
  </div>
  <span>{showOnlyAvailable ? "Available Only" : "Show All"}</span>
</label>
```

### **Results Counter**
```jsx
<p>Showing {filteredBikes.length} of {bikes.length} bikes</p>
```

### **Availability Badge**
```jsx
<span className={isAvailable ? "bg-green-500" : "bg-red-500"}>
  {isAvailable ? "Available" : "Not Available"}
</span>
```

---

## 🔄 **User Flow**

### **Scenario 1: Default View (Available Only)**
1. Page loads
2. Fetches all bikes from API
3. Filters to show only available bikes
4. Toggle shows "Available Only" (green)
5. Counter shows "Showing 3 of 5 bikes" (example)

### **Scenario 2: Show All Bikes**
1. User clicks toggle switch
2. Filter is disabled
3. Shows all bikes (available + unavailable)
4. Toggle shows "Show All" (gray)
5. Counter shows "Showing 5 of 5 bikes"
6. Unavailable bikes have red badges and disabled buttons

---

## 📱 **Responsive Design**

### **Desktop**
- Toggle switch in top-right corner
- 3-column grid layout
- Side-by-side header and toggle

### **Mobile**
- Toggle below the header
- Single column layout
- Stacked elements for better readability

---

## 🎯 **Example Data**

### **Available Bike**
```json
{
  "_id": "1",
  "name": "Himalayan BS6",
  "city": "vizag",
  "location": "INA Metro",
  "packageCost": 1399,
  "numberOfVehicles": 3,
  "isAvailable": true,
  "imageUrl": "https://..."
}
```
✅ **Shows in both modes**

### **Unavailable Bike (No vehicles)**
```json
{
  "_id": "2",
  "name": "Classic 350",
  "city": "vizag",
  "location": "INA Metro",
  "packageCost": 1149,
  "numberOfVehicles": 0,
  "isAvailable": true,
  "imageUrl": "https://..."
}
```
❌ **Only shows when "Show All" is enabled**

### **Unavailable Bike (Marked unavailable)**
```json
{
  "_id": "3",
  "name": "FZ S V3",
  "city": "vizag",
  "location": "INA Metro",
  "packageCost": 749,
  "numberOfVehicles": 2,
  "isAvailable": false,
  "imageUrl": "https://..."
}
```
❌ **Only shows when "Show All" is enabled**

---

## 🚀 **Testing**

### **Test Case 1: Available Only Filter**
```
1. Load page (default: Available Only)
2. Verify only bikes with isAvailable=true AND numberOfVehicles>0 are shown
3. Verify all bikes have green "Available" badges
4. Verify all "Book Now" buttons are enabled
```

### **Test Case 2: Show All Toggle**
```
1. Click toggle to "Show All"
2. Verify more bikes appear (including unavailable ones)
3. Verify unavailable bikes have red "Not Available" badges
4. Verify unavailable bikes have disabled buttons
5. Verify message explains why unavailable
```

### **Test Case 3: Empty State**
```
1. With Available Only: "No available bikes found. Try showing all bikes."
2. With Show All: "No bikes found in the database."
```

### **Test Case 4: Results Counter**
```
1. Verify counter updates when toggling
2. Format: "Showing X of Y bikes"
3. X = filtered count, Y = total count
```

---

## 💡 **Key Benefits**

1. **User Control**: Users decide what they want to see
2. **Better UX**: Clear visual indicators for availability
3. **Transparency**: Shows total bikes vs available bikes
4. **Accessibility**: Disabled buttons prevent invalid actions
5. **Helpful Messages**: Explains why bikes are unavailable

---

## 🔧 **Customization Options**

### **Change Default Filter**
```javascript
// Show all by default
const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
```

### **Add More Filters**
```javascript
// Example: Filter by city
const [selectedCity, setSelectedCity] = useState("all");

const filteredBikes = bikes.filter((bike) => {
  const matchesAvailability = showOnlyAvailable 
    ? bike.isAvailable && bike.numberOfVehicles > 0 
    : true;
  const matchesCity = selectedCity === "all" || bike.city === selectedCity;
  
  return matchesAvailability && matchesCity;
});
```

### **Change Availability Logic**
```javascript
// Example: Consider bikes with at least 2 vehicles as available
const isAvailable = bike.isAvailable && bike.numberOfVehicles >= 2;
```

---

## 📊 **Visual States**

| State | Badge Color | Button State | Button Text |
|-------|------------|--------------|-------------|
| Available (vehicles > 0) | 🟢 Green | Enabled | "Book Now" |
| Unavailable (vehicles = 0) | 🔴 Red | Disabled | "Not Available" |
| Unavailable (isAvailable = false) | 🔴 Red | Disabled | "Not Available" |

---

## ✅ **Checklist**

- [x] Filter bikes by availability
- [x] Toggle switch to show all bikes
- [x] Visual badges on bike cards
- [x] Disabled buttons for unavailable bikes
- [x] Results counter
- [x] Empty state messages
- [x] Responsive design
- [x] Hover effects
- [x] Accessibility (disabled states)
- [x] Clear labels and messages

---

## 🎉 **Result**

Your Searchdemo page now:
1. **Fetches** all bikes from `http://localhost:8000/api/v1/bikes`
2. **Filters** to show only available bikes by default
3. **Allows users** to toggle and see all bikes
4. **Displays** clear visual indicators for availability
5. **Prevents** booking unavailable bikes with disabled buttons
6. **Shows** helpful messages and counters

Perfect for production use! 🚀

