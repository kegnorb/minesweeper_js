var initZero = true;
var gameIsOn = false;
var boardCleared = true;
var dbgMsg = '';
var cYear = document.getElementsByClassName("current-year")[0];
var mineField = document.getElementsByClassName("minefield")[0];
var timeCntr = document.getElementById("time-cntr");
var mineCntr = document.getElementById("mine-cntr");
var faceContainer = document.getElementById("face-container");

const nrOfBombs = 10;
var gameTime = undefined;
var tCntr = 0;
var mCntr = 10;

var fieldArray = [
  [],[],[],[],[],[],[],[]
];

var bombID = [];

function FieldItem (itemID, isBomb){
    this.itemID = itemID;
    this.isBomb = isBomb;
    this.bombsAround = 0;
    this.isHidden = true;
    this.isRevealed = false;
    this.isFlagged = false;
}

function initStuffs() {
  console.log("Initialisation first: " + initZero);
  d = new Date();
  cYear.innerHTML = d.getFullYear();
  window.addEventListener('contextmenu', function (e) { 
    e.preventDefault(); 
  }, false);

  /*GENERATING RANDOM NUMBERS FOR BOMBS*/
  while (bombID.length < (nrOfBombs+1)) {
    let rnd = Math.floor(Math.random() * 64);
    if (bombID.indexOf(rnd) === -1) {
      bombID.push(rnd);
      //console.log("rnd id generated: " + rnd);
    }   
  }

  //dbg chck of rnd nums
  for (let r of bombID) {
    dbgMsg += r + ', ';
  }
  console.log("rnd IDs of the bombs:\n" + dbgMsg);
  dbgMsg = '';

  /*GENERATING REPRESENTATION OF THE MINEFIELD - 2D ARRAY OF FIELD-ITEM OBJECTS*/
  for (let i=0; i<8; i++) {
    for (let j=0; j<8; j++){
      let id = i*8 + j;
      let itemCreated = false;
      for (let k=0; k<nrOfBombs; k++) {
        if(id === bombID[k]) {
          fieldArray[i][j] = new FieldItem(id, true);
          itemCreated = true;
        }
      }
      if (!itemCreated) {
        //console.log("Item is not a bomb: " + id);
        fieldArray[i][j] = new FieldItem(id, false); 
      }
    }
  }

  /*CALCULATING FIELD-ITEM VALUES - COUNTING THE BOMBS AROUND*/
  for (let i=0; i<8; i++) {
    for (let j=0; j<8; j++){
      //let id = fieldArray[i][j].itemID;
      if (!fieldArray[i][j].isBomb) {
        let chckM = [];
        let chckN = [];
        if (i > 0 && i < 7) {
          chckM = [i, i-1, i+1]; 
        }
        else if (i === 0) {
          chckM = [i, i+1];
        }
        else {
          chckM = [i, i-1];
        }
        
        if (j > 0 && j < 7) {
          chckN = [j, j-1, j+1]; 
        }
        else if (j === 0) {
          chckN = [j, j+1];
        }
        else {
          chckN = [j, j-1];
        }
  
        let combos = (chckM.length * chckN.length) - 1;
  
        for (let x=0; x<chckM.length; x++) {
          for (let y=0; y<chckN.length; y++) {
            let m = chckM[x];
            let n = chckN[y];
            if (m !== i || j !== n) {
              if (fieldArray[m][n].isBomb) {
                fieldArray[i][j].bombsAround++;              
              }
            }
          }
        }   
      }   
    }
  }


  /*GENERATING/INITIALISING HTML NODES OF THE FRONTEND VIEW*/
  timeCntr.innerHTML = '000';
  mineCntr.innerHTML = '010';

  if(!boardCleared) {
    boardCleared = true;
    while (mineField.firstChild) {
      mineField.removeChild(mineField.firstChild);
    }
  }

  for (let i=0; i<8; i++) {
    for (let j=0; j<8; j++) {
      var fieldItem = document.createElement("div");
      fieldItem.classList.add("field-item");
      fieldItem.classList.add("field-item-hidden");
      //let x = parseInt(fieldArray[i][j].itemID);
      fieldItem.setAttribute("field-id", fieldArray[i][j].itemID);
      fieldItem.addEventListener("mousedown", function (event) {
        event.preventDefault();
        console.log("Mousedowned on: " + this.innerHTML);
        if (event.button === 2) {
          console.log("do some flag shit");
        }
        else {
          if (gameIsOn || boardCleared) {
            this.style.border = "1px solid rgb(153, 152, 152)";
          }
        }
      });
      fieldItem.addEventListener("mouseup", updateField);
        

      if (fieldArray[i][j].isBomb) {
        fieldItem.innerHTML = '<img class="bomb-img" height="21" width="21" \
                                src="imgs/bomb.png">';  
      }
      else {
        if (fieldArray[i][j].bombsAround !== 0) {
          fieldItem.innerHTML = fieldArray[i][j].bombsAround;
          switch (fieldArray[i][j].bombsAround) {
            case 1:
              fieldItem.style.color = "#0000CC";
              break;
            case 2: 
              fieldItem.style.color = "green";
              break;
            case 3: 
              fieldItem.style.color = "red";
              break;  
            case 4: 
              fieldItem.style.color = "#000055";
              break;  
            case 5: 
              fieldItem.style.color = "#550000";
              break;    
            default:
              fieldItem.style.color = "grey";    
          }
        }
        else {
          fieldItem.innerHTML = '';
        }
      }
      mineField.appendChild(fieldItem);    
    }
  }
  
  initZero = false;
}//initStuffs()




function startGame() {
  if (!gameIsOn && boardCleared) {
    gameIsOn = true;
    boardCleared = false;
    console.log("The game has started: " + gameIsOn);
    gameTime = setInterval(
      function() {
        let tCntrStr = '';
        tCntr++;
        if(tCntr < 100) {
          tCntrStr = '0';
          if(tCntr < 10) {
            tCntrStr += '0';
          }
        }
        tCntrStr += tCntr.toString();
        timeCntr.innerHTML = tCntrStr;
      },
      1000
    )
  }
}//startGame()



function chckWin() {
  let isHiddenCntr = 0;
  for (let i=0; i<8; i++) {
    for (let j=0; j<8; j++) {
      if (fieldArray[i][j].isHidden) {
        isHiddenCntr++;
      }
    }
  }
  if (isHiddenCntr < 11) {
    winGame();
  }
}

function winGame() {
  //faceswap (sunglasses);
  console.log("Confuckinggratulation it is a WIN: " + tCntr); 
  endGame();
}

function insetBtn() {
  faceContainer.style.borderStyle = "inset";
}



function resetGame() {
  faceContainer.style.borderStyle = "outset";
  if (!boardCleared){
    endGame();
    initStuffs();
    //boardCleared = true;    
  }
}



function endGame() {
  if (gameTime !== undefined && gameTime !== null) {
    clearInterval(gameTime);
  }
  tCntr = 0;
  bombID = [];
  fieldArray = [
    [],[],[],[],[],[],[],[]
  ];
  gameIsOn = false;
  console.log("The game has been stopped: " + !gameIsOn);
}//endGame()


function updateField(event) {
  event.preventDefault();
  let fieldID = this.getAttribute("field-id");
  let yc = parseInt(fieldID/8); //i
  let xc = fieldID - (8*yc); //j

  if (event.button === 2) {
    console.log("Flaggy flag");
    if (fieldArray[yc][xc].isFlagged) {
      //remove flag
      fieldArray.isFlagged = false;
    }
    else {
      //add flag
      fieldArray[yc][xc].isFlagged = true;
    }
  }
  else {
    console.log("Mouseupped on: " + fieldID );
    console.log("i(y): " + yc + " j(x): " + xc);
    if (gameIsOn || boardCleared) {
      fieldArray[yc][xc].isHidden = false;
      updateView(this);
      if (gameIsOn && !fieldArray[yc][xc].isBomb) {
        chckWin();
      }
    }
  }
}//updateField()



function updateView(hit) {
  console.log("Updating View");
  for (let i=0; i<8; i++) {
    for(let j=0; j<8; j++ ) {
      if (!fieldArray[i][j].isHidden && !fieldArray[i][j].isRevealed) {
        if (fieldArray[i][j].isBomb){
          console.log("Bomb hit | Game Over!");
          hit.firstChild.src = "imgs/msweep.jpg";
          showBombs();
          endGame();
          return 0;
        }
        else if(fieldArray[i][j].bombsAround < 1) {
          console.log("empty field-item");
          showEmpties(i, j);
        }
        document.getElementsByClassName("field-item")[i*8+j].classList.remove("field-item-hidden");
        fieldArray[i][j].isRevealed = true;
      }
    }
  }
}//updateView()



function showBombs() {
  let bombImgs = document.getElementsByClassName("bomb-img");
  for (b of bombImgs) {
    b.style.display = "block";
    b.parentElement.style.border = "1px solid rgb(153, 152, 152)";
  }
}



function showEmpties(y, x) {
  let adjacentsY = [];
  let adjacentsX = [];
  if (y > 0 && y < 7) {
    adjacentsY = [y-1, y, y+1];
  }
  else if (y === 0 ) {
    adjacentsY = [y, y+1];
  }
  else {
    adjacentsY = [y-1, y];
  }

  if (x > 0 && x < 7) {
    adjacentsX = [x-1, x, x+1];
  }
  else if (x === 0) {
    adjacentsX = [x, x+1];
  }
  else {
    adjacentsX = [x-1, x];
  }

  console.log("y: " + y + " x: "+ x);

  for (let a=0; a<adjacentsY.length; a++) {
    for (let b=0; b<adjacentsX.length; b++) {
      console.log(adjacentsY[a], adjacentsX[b], fieldArray[adjacentsY[a]][adjacentsX[b]].itemID );
      let adjItem = fieldArray[adjacentsY[a]][adjacentsX[b]]; 
      if (adjItem.isHidden && !adjItem.isRevealed) {
        if (!adjItem.isBomb) {
          adjItem.isHidden = false;
          adjItem.isRevealed = true;
          if (adjItem.bombsAround < 1) {
            showEmpties(adjacentsY[a], adjacentsX[b]);
          }
          document.getElementsByClassName("field-item")[adjItem.itemID].classList.remove("field-item-hidden");
        }
      }
      
    }
  }
}//showEmpties()


/*
SOLVED - ISSUE #1: Empty fields should open up all of their adjacents 
            till numbered fields appear. (MISSING) - recursion!
SOLVED - ISSUE #2: WIN the game case implementation (MISSING)
- ISSUE #3: When first hit is a bomb - game dont stop (BUG)            
- ISSUE #4: Mousemove event (mousedown -> mousemove -> mouseup) 
            border style change should follow and update according to cursor position,
            when mouse is moved (BUG/MISSING)
- ISSUE #5: Flags (disable field-item), discern left (vs) right mouse clicks (MISSING)
- ISSUE #6: Dead & Win face swap (#6.2 scared face swap) (MISSING)
- ISSUE #7: More levels (Implement Advanced and Expert options or even Custom layout)
*/
