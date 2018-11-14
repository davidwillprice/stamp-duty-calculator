# Stamp Duty Tax Calculator
Calculator for Stamp Duty Tax when buying a property in the UK. Accurate as of November 2018.

## Intro
While working for estate agents Love Your Postcode in 2016, I was asked to create a calculator for the website that would allow users to input the cost of the property and return the amount of Stamp Duty Tax back, depending on if the user was a first-time buyer, buying a second property or neither. As I didn't know JavaScript at the time, I worked out the values for each cell in the calculator table using algebra and then my JavaScript/PHP developer colleague translated those workings into a finished calculator.

As I started to learn JavaScript in October 2018, I challenged myself to re-code the SDT calculator from scratch.

## Screenshot
![alt text](https://raw.githubusercontent.com/davidwillprice/stamp-duty-calculator/master/Stamp%20Duty%20Calculator%20Screenshot_14%2010%202018.png)


## How it works
Stamp Duty Tax is a progressive tax paid when purchasing a freehold, leasehold or shared ownership residential property in England, Northern Ireland and Wales. The rates were overhauled first in 2014 – moving from a “slab” to a “tiered” system. So instead of one rate being applied to the entire purchase value, a number of rates were applied at successive thresholds.

As each tax band has a different amount of tax depending on if the user is a first-time buyer, buying a second property or neither, the different percentages of taxes are stored in arrays at the beginning of the JavaScript file. Also included is an array with each the tax bands listed.

If the user has input a house value and clicks on the 'CALCULATE' button or the buyer type inputs, the calculator activates using the standard tax rates, first-time buyer rates (If the user has 'Are you a first time buyer?' selected) or second property rates (If the user has 'Is this a second property?' selected). 

Starting with the first row of calculations: 

* If the house price minus the lower tax band is less than or equal to zero, the row is hidden via CSS from the user as the taxable sum is zero;
* If the house price minus the lower tax band is greater than zero and the house price minus the lower tax band is smaller than the upper tax band minus the lower tax band, the house price minus the lower tax band is the taxable sum;
* Otherwise, the upper tax band minus the lower tax band is the taxable sum.

The UI for the row is then populated with the percentage tax for that tax band, the taxable sum and the actual tax for that tax band (the taxable sum multiplied by the percentage tax). The tax for that tax band is then added to the SDT total.

The calculator then cycles to the next row/tax band using a for loop, adding the tax to the SDT total.

Once the calculator has populated the table, the final SDT total is added to the UI, with the effect tax rate (The SDT total divided by the house price, and then multiplied by 100). 

Pound sterling values are processed through a function called 'formatMoney', adding the '£', commas to split up values over a thousand, and two decimal places if the number isn't round.

Functions 'firstTime' and 'secondProp' make sure that only one of 'Are you a first time buyer?' or 'Is this a second property?' is active at any one time, as you can't be a first time buyer and buying a second property. However, I used HTML inputs rather than a radio as it's important neither of these options have to be selected.

## To do list
1) Add shared ownership as third buyer option;
2) Add additional JavaScript comments, better explaining the code;
3) Tidy JavaScript file;
4) Improve appearance of the calculator (Animations for the table loading)

## Built With

* [Brackets](http://brackets.io/) - IDE
* [Excel](https://products.office.com/en-gb/excel) - Used for drafting table calculations
* [Codepen](https://codepen.io/) - Used for additional testing

## Author
* **David Price** - [Website](https://davidwillprice.com)
