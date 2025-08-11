// class Car {
//   constructor(brand, speed) {
//     this.brand = brand;
//     this.speed = speed;
//   }

//   drive() {
//     console.log(`${this.brand} is driving at ${this.speed} km/h`);
//   }
// }

// const myCar = new Car("BMW", 120);
// myCar.drive();
// class Bicycle {
//   constructor(price, raiting) {
//     this.price = price;
//     this.raiting = raiting;
//   }

//   driving() {
//     console.log(
//       `${this.price} is this bicycle, raiting is ${this.raiting} point`
//     );
//   }
// }

// // const dreamBicycle = new Bicycle("$8100", "5/5");
// // dreamBicycle.driving();

// class costBicycle extends Bicycle {
//   // A subclass needs to call the superclass constructor.
//   constructor(price, raiting) {
//     super(price, raiting);
//   }

//   // This method now correctly updates the properties.
//   // The parameters have a default value to prevent errors if not passed.
//   changes(newPrice = "", newRaiting = "") {
//     this.price = newPrice;
//     this.raiting = newRaiting;
//   }
// }

// const myBicycle = new costBicycle("12000$", "8/9");
// myBicycle.driving(); // This will use the properties from the constructor

// // Now you can update the properties using the changes() method
// myBicycle.changes("15000$", "9/9");
// myBicycle.driving(); // This will show the updated values

class Products {
  constructor(color, weight, price, rating) {
    this.color = color;
    this.weight = weight;
    this.price = price;
    this.rating = rating;
  }

  getProductInfo() {
    console.log(
      `Product color: ${this.color}, weight: ${this.weight}, price : ${this.price}, rating: ${this.rating} point`
    );
  }
}

class Bicycle extends Products {
  constructor(color, weight, price, rating, popularity) {
    super(color, weight, price, rating);
    this.popularity = popularity;
  }

  whyPopular() {
    console.log(
      `Cuz, this ${this.color} bicycle is ${this.weight} to heavy, price will be ${this.price}, and raiting is ${this.rating} connected with ${this.popularity}. `
    );
  }
}
const mountainBic = new Bicycle("red", "5kg", "$810", "5/5", "top-up");
mountainBic.getProductInfo();
mountainBic.whyPopular();
