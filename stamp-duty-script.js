//Data controller module
let dataController = (function() {
    
    let data = {
        totalTax: 0
    };
                  
    return {
        // Different tax percentages and taxBand data
        standBuyer: [0, 0.02, 0.05, 0.05, 0.10, 0.12],
        firstBuyer: [0, 0, 0, 0.05, 0.10, 0.12],
        secBuyer: [0.03, 0.05, 0.08, 0.08, 0.13, 0.15],
        taxBand: [0, 125000, 250000, 300000, 925000, 1500000, Infinity],
        
        wipe: function() {
            data.totalTax = 0;
        },
        
        calTaxSum : function (houseCost, i) {
            let loBand = dataController.taxBand[i];
            let upBand = dataController.taxBand[i+1];
            if ((houseCost - loBand) <= 0) {
                return 0;
            } else if ((houseCost - loBand) > 0 && (houseCost - loBand) < (upBand - loBand)) {
                return (houseCost - loBand);
            } else {
                return (upBand - loBand);
            } 
        },
        
        calTax : function (taxableSum, percentage) {
            return taxableSum * percentage;
        },
        
        storeTax: function(tax) {
            data.totalTax += tax;
        },
        
        getTotalTax: function() {
            return data.totalTax;
        },
        
        calEffRate: function(totalTax, houseCost) {
            return (totalTax / houseCost) * 100;
        }
    };
})();

//UI controller module
let UIController = (function() {
    
    //DOMStrings to streamline UI   
    let DOMstrings = {
        cost: 'costofhouse',
        calBtn: 'calcstampduty',
        firstTimeBtn: 'firstTime',
        secondPropBtn: 'secondProp',
        resultsTable: '.stampDutyCalcuations',
        row: 'stamp-duty-row',
        perColumn: 'stamp-b',
        taxSumColumn: 'stamp-c',
        taxColumn: 'stamp-d',
        totalTax: 'stDutyTax',
        effRate: 'effectRate',
    };
    
    function formatMoney(n) {
        //Add two decimal places if the number isn't round and add commas to split up money
        if (n % 1 === 0) {
            return '£' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
        } else {
            return '£' + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");  
        }
    }
    
    return {
        //Obtain house price
        getInput: function() {
            return { 
                housePrice: parseFloat(document.getElementById(DOMstrings.cost).value)
            }
        },
        
        //Return DOMstrings to global ctrl
        getDOMstrings: function() {
            return DOMstrings;
        },
    
        showTable: function () {
            document.querySelector(DOMstrings.resultsTable).style.display = 'inline-block';
        },
        
        showRow: function(i) {
            document.getElementById(DOMstrings.row + i).classList.remove('hide');
        },
        
        hideRow: function(i) {
            document.getElementById(DOMstrings.row + i).classList.add('hide');
        },
        
        displayPercentages: function(percentage, i) {
            document.getElementById(DOMstrings.perColumn + (i+2)).textContent = (percentage * 100) + '%';
        },
        
        displayTaxableSum: function(taxableSum, i) {
            document.getElementById(DOMstrings.taxSumColumn + (i+2)).textContent = formatMoney(taxableSum);
        },
        
        displayTax: function(tax, i) {
            document.getElementById(DOMstrings.taxColumn + (i+2)).textContent = formatMoney(tax);  
        },
        
        displayTotalTax: function(totalTax) {
            document.getElementById(DOMstrings.totalTax).textContent = formatMoney(totalTax);  
        },
        
        displayEffRate: function(effRate) {
            document.getElementById(DOMstrings.effRate).textContent = +parseFloat(effRate).toFixed(2) + '%';
        },
        
        getBuyerType: function() {
            if (document.getElementById(DOMstrings.firstTimeBtn).checked == true) {
                return 'firstBuyer';
            } else if (document.getElementById(DOMstrings.secondPropBtn).checked == true) {
                return 'secBuyer';
            } else {
                return 'standBuyer';
            }
        },
        
        unselectFirstTime: function() {
            document.getElementById(DOMstrings.firstTimeBtn).checked = false;
        },
        
        unselectSecProp: function() {
            document.getElementById(DOMstrings.secondPropBtn).checked = false;
        }
    }
    
})();

//Global controller module
let controller = (function(dataCtrl, UICtrl) {
    
    let stampCalc = function(buyerType) {
        let houseCost;
        
        // Wipe any previous calculations
        dataCtrl.wipe();
        
        //1. Get the cost of the house
        houseCost = UICtrl.getInput().housePrice;
        //2. Only proceed if there is a house cost
        if (houseCost >= 0) {
            
            //3. Show results table
            UICtrl.showTable();
            
            //4. Loop through tax bands
            for (let i = 0; i < buyerType.length; i++) {
                
                //5. Display percentages
                UICtrl.displayPercentages(buyerType[i], i);
                
                //6. Calculate Taxable Sum
                let taxableSum = dataCtrl.calTaxSum(houseCost, i);
                
                if (taxableSum === 0) {
                    
                    //If the taxable Sum for the row is 0, stop calculations & hide the row
                    UICtrl.hideRow(i);
                    
                } else {
                    
                    UICtrl.showRow(i);
        
                    //7. Display Taxable Sum
                    UICtrl.displayTaxableSum(taxableSum, i);
                    
                    //8.Calculate Tax
                    let tax = dataCtrl.calTax(taxableSum, buyerType[i]);
                    
                    //9.Store Tax in data
                    dataCtrl.storeTax(tax);
                    
                    //10. Display Tax
                    UICtrl.displayTax(tax, i);
                }
            }
            
            //Total Tax
            let totalTax = updateTotalTax();
            
            updateEffectiveRate(totalTax, houseCost);
        }    
    };
    
    let updateTotalTax = function() {
        //11. Get total Tax 
        let totalTax = dataCtrl.getTotalTax();
            
        //12. Display Total Tax
        UICtrl.displayTotalTax(totalTax);
        
        return totalTax;
    }
    
    let updateEffectiveRate = function(totalTax, houseCost) {
        //12. Calcualate Effective Rate
        let effRate = dataCtrl.calEffRate(totalTax, houseCost);
            
        //13. Display Effective Rate
        UICtrl.displayEffRate(effRate); 
    }
    
    let checkBuyerType = function() {
        let buyerType = UICtrl.getBuyerType();
        if (buyerType == 'firstBuyer') {
            return dataCtrl.firstBuyer;
        } else if (buyerType == 'secBuyer') {
            return dataCtrl.secBuyer;
        } else {
            return dataCtrl.standBuyer;
        }
    }

   let firstTime = function() {
       let buyerType = UICtrl.getBuyerType();
       UICtrl.unselectSecProp();
       runCal();
    }
   
    let secProp = function() {
        let buyerType = UICtrl.getBuyerType();
        UICtrl.unselectFirstTime();
        runCal();
    }
    
    //Run the SDT calculator with the active buyer type
    let runCal = function() {
        stampCalc(checkBuyerType());
    };
    
    let setupEventListeners = function() {
        //Obtain DOM strings for use in controller
        let DOM = UICtrl.getDOMstrings();
    
        //Calculate on btn click
        document.getElementById(DOM.calBtn).addEventListener('click', runCal);
        
        //First Time Buyer Button Clicked
        document.getElementById(DOM.firstTimeBtn).addEventListener('click', firstTime);
        
        //Second Property Button Clicked
        document.getElementById(DOM.secondPropBtn).addEventListener('click', secProp);
        
        //Calculate on return key
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                runCal();
            }
        });
    };    
    
    return {
        init:function() {
            console.log('Application has started.');
            setupEventListeners();
        }
    };    

})(dataController, UIController);   

controller.init();
