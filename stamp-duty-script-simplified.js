var standBuyer = [0, 0.02, 0.05, 0.05, 0.10, 0.12];
var firstBuyer = [0, 0, 0, 0.05, 0.10, 0.12];
var secBuyer = [0.03, 0.05, 0.08, 0.08, 0.13, 0.15];
var taxBand = [0, 125000, 250000, 300000, 925000, 1500000, Infinity];
var taxSum;

function stampCalc(buyerType) {
    var housePrice = document.getElementById('costofhouse').value;
    if (housePrice != "") {
        var totalTax = 0;
        document.querySelector('.stampDutyCalcuations').style.display = 'inline-block';
        for (var i = 0; i < buyerType.length; i++) {
            document.getElementById('stamp-duty-row' + i).classList.remove('hide');
            var upBand = taxBand[i+1];
            var loBand = taxBand[i];
            //Calculating Taxable sum
            if ((housePrice - loBand) <= 0) {
                taxSum = 0;
                document.getElementById('stamp-duty-row' + i).classList.add('hide');
            } else if ((housePrice - loBand) > 0 && (housePrice - loBand) < (upBand - loBand)) {
                taxSum = + (housePrice - loBand);
            } else {
                taxSum = (upBand - loBand);
            }
            //Add band's tax to total tax
            totalTax += (buyerType[i] * taxSum);
            //Populating row data
            document.getElementById('stamp-b' + (i+2)).textContent = (buyerType[i] * 100) + '%';
            document.getElementById('stamp-c' + (i+2)).textContent = formatMoney(taxSum);
            document.getElementById('stamp-d' + (i+2)).textContent = formatMoney(buyerType[i] * taxSum);  
    }
    //Populate total tax and effective rate
    document.getElementById('stDutyTax').textContent = formatMoney(totalTax);
    document.getElementById('effectRate').textContent = +parseFloat((((totalTax / housePrice)*100 )).toFixed(2)) + '%';
    }
}

function formatMoney(n) {
    //Add two decimal places if the number isn't round and add commas to split up money
    if (n % 1 === 0) {
       return '£' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
    } else {
       return '£' + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");  
    }
};

function calcBut() {
    //Calculate button is clicked. Run calcutions depending on buyer type
    if (document.getElementById("firstTime").checked == true) {
        stampCalc(firstBuyer);
    } else if (document.getElementById("secondProp").checked == true) {
        stampCalc(secBuyer);
    } else {
        stampCalc(standBuyer);
    }
}

function firstTime() {
    //First time buyer is clicked. If ticking, run FTB calc and untick second property box. If unticking, run default calc.
    if (document.getElementById("firstTime").checked == false) {
        stampCalc(standBuyer);
    } else {
        stampCalc(firstBuyer);
        document.getElementById("secondProp").checked = false;
    }
}
function secondProp() {
    //Second property is clicked. If ticking, run second property calc and untick FTB box. If unticking, run default calc. 
    if (document.getElementById("secondProp").checked == false) {
        stampCalc(standBuyer);
    } else {
        stampCalc(secBuyer);
        document.getElementById("firstTime").checked = false;
    }
}
