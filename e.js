// دالة لنقل قطعة من مكان إلى آخر
function placePiece(pieceId, targetId) {
    console.log("تم استدعاء placePiece()", pieceId, targetId);

    const pieceElement = document.getElementById(pieceId);
    const targetElement = document.getElementById(targetId);

    if (!pieceElement || !targetElement) return;

    const isPawn = pieceElement.dataset.piece === "pawn" || pieceElement.dataset.piece === "pawn1";

    if (isPawn) {
        const promoted = handlePawnPromotion(pieceElement, targetId);
        if (promoted) {
            pieceElement.remove();
            return;
        }
    }

    //  انقل القطعة بشكل سليم
    pieceElement.remove(); // احذفها من مكانها الحالي
    targetElement.appendChild(pieceElement); // أضفها للمربع الجديد

    //  أعد تفعيل خاصية النقر بعد النقل
    pieceElement.setAttribute("onclick", "selectPiece(this)");
}



// إضافة حدث النقر لكل القطع الموجودة على اللوحة
document.querySelectorAll('.square img').forEach(img => {
    img.addEventListener('click', function() {
        const pieceType = this.getAttribute('data-piece'); // نوع القطعة
        const pieceColor = this.getAttribute('data-color'); // لون القطعة

        if (pieceType && pieceColor) {
            switch (pieceType) {
                case 'pawn':
                case 'pawn1':
                    movePawn(this, pieceColor); // تحريك البيدق
                    break;
                case 'castle':
                case 'castle1':
                    moveCastle(this); // تحريك القلعة
                    break;
                case 'horse':
                case 'horse1':
                    moveHorse(this); // تحريك الحصان
                    break;
                case 'elephant':
                case 'elephant1':
                    moveElephant(this); // تحريك الفيل
                    break;
                case 'king':
                case 'king1':
                    moveKing(this); // تحريك الملك
                    break;
                case 'minister':
                case 'minister1':
                    moveMinister(this); // تحريك الوزير
                    break;
            }
        }
    });
});

// دالة لإزالة جميع الدوائر الحمراء من اللوحة
function removeCircles() {
    document.querySelectorAll('.red-circle').forEach(circle => circle.remove());
}

// دالة لتحريك قطعة بناءً على الاتجاهات المتاحة لها
function movePiece(imgElement, directions, attackDirections) {
    removeCircles(); // تنظيف الدوائر الحمراء السابقة
    const square = imgElement.parentElement;
    const id = parseInt(square.id, 10); // المربع الحالي
    const pieceColor = imgElement.getAttribute("data-color");

    // إضافة دوائر للحركات القانونية
    directions.forEach(dir => {
        const targetId = id + dir;
        const targetSquare = document.getElementById(targetId);

        if (targetSquare && targetSquare.innerHTML === "") {
            let circle = document.createElement("div");
            circle.classList.add("red-circle");
            circle.style.width = "20px";
            circle.style.height = "20px";
            circle.style.backgroundColor = "red";
            circle.style.borderRadius = "50%";
            circle.style.position = "absolute";
            circle.style.cursor = "pointer";
            targetSquare.appendChild(circle);

            // عند النقر، حرك الجندي وتحقق من الترقية
            circle.addEventListener("click", function () {
                targetSquare.innerHTML = "";
                targetSquare.appendChild(imgElement);
                removeCircles();
                handlePawnPromotion(imgElement, parseInt(targetSquare.id, 10));
            });
        }
    });

    // إضافة دوائر لهجوم العدو
    attackDirections.forEach(dir => {
        const targetId = id + dir;
        if (targetId < 11 || targetId > 88) return;

        const targetSquare = document.getElementById(targetId);

        if (
            targetSquare &&
            targetSquare.innerHTML !== "" &&
            targetSquare.querySelector("img").getAttribute("data-color") !== pieceColor
        ) {
            targetSquare.style.position = "relative";

            let circle = document.createElement("div");
            circle.classList.add("red-circle");
            circle.style.width = "20px";
            circle.style.height = "20px";
            circle.style.backgroundColor = "red";
            circle.style.borderRadius = "50%";
            circle.style.position = "absolute";
            circle.style.cursor = "pointer";
            circle.style.top = "50%";
            circle.style.left = "50%";
            circle.style.transform = "translate(-50%, -50%)";

            targetSquare.appendChild(circle);

            // عند النقر، اقتل العدو ثم تحقق من الترقية
            circle.addEventListener("click", function () {
                targetSquare.innerHTML = "";
                targetSquare.appendChild(imgElement);
                removeCircles();
                handlePawnPromotion(imgElement, parseInt(targetSquare.id, 10));
            
                // 👇 إعادة تفعيل الحركة بعد النقل
                if (imgElement.classList.contains("pawn")) {
                    imgElement.onclick = () => movePawn(imgElement, pieceColor);
                }
            });
            console.log("Moved: ", imgElement.id);
            imgElement.onclick = () => console.log("أنا حيّ!");
            
        }
    });
}

// متغيرات لتتبع أول حركة للجندي
let firstMove = {};

// دالة تحريك الجندي فقط
function movePawn(imgElement, color) {
    let directions = [];
    let attackDirections;
    const id = imgElement.id;
    const square = imgElement.parentElement;
    const currentId = parseInt(square.id, 10);

    if (firstMove[id] === undefined) {
        firstMove[id] = true;
    }

    if (color === 'white') {
        attackDirections = [9, 11];
        if (firstMove[id] && Math.floor(currentId / 10) === 2) {
            const oneStep = document.getElementById(currentId + 10);
            const twoStep = document.getElementById(currentId + 20);
            if (oneStep && oneStep.innerHTML === "") {
                directions.push(10);
                if (twoStep && twoStep.innerHTML === "") {
                    directions.push(20);
                }
            }
        } else {
            const oneStep = document.getElementById(currentId + 10);
            if (oneStep && oneStep.innerHTML === "") {
                directions.push(10);
            }
        }
    } else if (color === 'black') {
        attackDirections = [-9, -11];
        if (firstMove[id] && Math.floor(currentId / 10) === 7) {
            const oneStep = document.getElementById(currentId - 10);
            const twoStep = document.getElementById(currentId - 20);
            if (oneStep && oneStep.innerHTML === "") {
                directions.push(-10);
                if (twoStep && twoStep.innerHTML === "") {
                    directions.push(-20);
                }
            }
        } else {
            const oneStep = document.getElementById(currentId - 10);
            if (oneStep && oneStep.innerHTML === "") {
                directions.push(-10);
            }
        }
    }

    // هنا يمكن مناداة دالة تحريك القطعة مع الاتجاهات
    movePiece(imgElement, directions, attackDirections, (oldId, newId) => {
        if (firstMove[id]) {
            firstMove[id] = false;
        }
    
        //  استدعاء دالة الترقية بعد نقل البيدق
        handlePawnPromotion(document.getElementById(imgElement.id), newId);
    });
    
}

function moveLinearPiece(imgElement, directions) {
    removeCircles();
    const square = imgElement.parentElement;
    const id = parseInt(square.id, 10);
    const pieceColor = imgElement.getAttribute("data-color");

    directions.forEach(dir => {
        let nextId = id + dir;

        while (isValidPosition(nextId) && isSameLine(id, nextId, dir)) {
            const targetSquare = document.getElementById(nextId);
            if (!targetSquare) break;

            const targetPiece = targetSquare.querySelector("img");

            if (targetPiece) {
                if (targetPiece.getAttribute("data-color") !== pieceColor) {
                    addCircleToSquare(targetSquare, imgElement);
                }
                break;
            } else {
                addCircleToSquare(targetSquare, imgElement);
            }

            nextId += dir;
        }
    });
}

function isValidPosition(id) {
    return id >= 11 && id <= 88;
}

function isSameLine(from, to, dir) {
    const fromRow = Math.floor(from / 10);
    const fromCol = from % 10;
    const toRow = Math.floor(to / 10);
    const toCol = to % 10;

    if ([1, -1].includes(dir)) {
        // حركة أفقية، لازم نفس الصف
        return fromRow === toRow;
    } else if ([10, -10].includes(dir)) {
        // حركة عمودية، عادي
        return true;
    } else if ([11, -11, 9, -9].includes(dir)) {
        // قطري، لازم الفرق بين الصف والعمود متساوي
        return Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol);
    }
    return true;
}


function addCircleToSquare(square, imgElement) {
    const circle = document.createElement("div");
    circle.classList.add("red-circle");
    circle.style.cssText = `
        width: 20px;
        height: 20px;
        background-color: red;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
    `;
    square.appendChild(circle);

    circle.addEventListener("click", () => {
        square.innerHTML = "";
        square.appendChild(imgElement);
        removeCircles();
        handlePawnPromotion(imgElement, parseInt(square.id, 10));
    });
}


// دالة الترقية تكون هنا مستقلة خارج دالة movePawn
function handlePawnPromotion(pawnElement, targetId) {
    const color = pawnElement.getAttribute("data-color");
    const row = Math.floor(targetId / 10);

    if ((color === "white" && row === 8) || (color === "black" && row === 1)) {
        const newPiece = prompt("اختر الترقية: vazir, kale, file, at", "vazir");

        const pieceMap = {
            vazir: "queen",
            kale: "rook",
            file: "bishop",
            at: "knight"
        };

        const pieceType = pieceMap[newPiece];

        if (pieceType) {
            const pieceImages = {
                white: {
                    queen: "beyaz taş.png",
                    rook: "WhatsApp_Image_2024-05-10_at_12.00.00_AM__5_-removebg-preview.png",
                    bishop: "file_beyaz_2-removebg-preview.png",
                    knight: "at siyah.png"
                },
                black: {
                    queen: "siyah_taş-removebg-preview.png",
                    rook: "siyah_at2-removebg-preview.png",
                    bishop: "file siyah.png",
                    knight: "siyah_at2-removebg-preview.png"
                }
            };

            const newImg = document.createElement("img");
            newImg.src = `img (2)/img/img/${pieceImages[color][pieceType]}`;
            newImg.setAttribute("data-piece", pieceType);
            newImg.setAttribute("data-color", color);
            newImg.style.width = "70px";
            newImg.id = `${color}_${pieceType}_${Math.floor(Math.random() * 10000)}`;

            // ✅ تعيين الحركة الصحيحة بالطريقة الآمنة
            if (pieceType === "queen") {
                newImg.setAttribute("onclick", "moveLinearPiece(this, [11, -11, 9, -9, 10, -10, 1, -1])");
            } else if (pieceType === "rook") {
                newImg.setAttribute("onclick", "moveLinearPiece(this, [10, -10, 1, -1])");
            } else if (pieceType === "bishop") {
                newImg.setAttribute("onclick", "moveLinearPiece(this, [11, -11, 9, -9])");
            } else if (pieceType === "knight") {
                newImg.setAttribute("onclick", "movePiece(this, [21, 19, 12, 8, -21, -19, -12, -8], [21, 19, 12, 8, -21, -19, -12, -8])");
            }

            // استبدال الجندي بالقطعة الجديدة
            const parentSquare = pawnElement.parentElement;
            parentSquare.innerHTML = "";
            parentSquare.appendChild(newImg);
        } else {
            alert("الاختيار غير صحيح. حاول مرة ثانية.");
        }
    }
}




// دالة لتحريك القلعة
function moveCastle(imgElement) {
    const directions = [10, -10, 1, -1];  // 4 اتجاهات حركة القلعة
    const square = imgElement.parentElement;
    const id = parseInt(square.id, 10);
    const color = imgElement.getAttribute("data-color");

    removeCircles(); // تنظيف دوائر الحركة القديمة

    directions.forEach(dir => {
        let step = 1;
        while (true) {
            const targetId = id + dir * step;

            // التأكد أن targetId داخل حدود الرقعة
            if (targetId < 11 || targetId > 88) break;

            const currentColumn = id % 10;
            const targetColumn = targetId % 10;

            // منع تجاوز الأعمدة (التحرك الأفقي)
            if ((dir === 1 || dir === -1) && Math.abs(targetColumn - currentColumn) !== step) {
                break;
            }
            
           console.log("Checking targetId:", targetId, "currentColumn:", currentColumn, "targetColumn:", targetColumn, "step:", step);

            const targetSquare = document.getElementById(targetId);
            if (!targetSquare) break;

            if (targetSquare.innerHTML === "") {
                createMoveCircle(targetSquare, imgElement);  // مربع فاضي → حركة
            } else {
                const targetPiece = targetSquare.querySelector("img");
                if (targetPiece && targetPiece.getAttribute("data-color") !== color) {
                    createAttackCircle(targetSquare, imgElement);  // قطعة عدو → أكل
                }
                break;  // توقف بعد وجود قطعة (صديقة أو عدوة)
            }
            step++;
        }
    });
}

// دالة لإنشاء دائرة حركة على مربع فارغ
function createMoveCircle(square, imgElement) {
    let circle = document.createElement("div");
    circle.classList.add("red-circle");
    circle.style.cssText = `
        width: 20px;
        height: 20px;
        background-color: red;
        border-radius: 50%;
        position: absolute;
        cursor: pointer;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `;
    square.style.position = "relative";
    square.appendChild(circle);

    circle.addEventListener("click", () => {
        square.innerHTML = "";
        square.appendChild(imgElement);
        removeCircles();
    });
}

// دالة لإنشاء دائرة أكل على مربع فيه قطعة عدوة
function createAttackCircle(square, imgElement) {
    createMoveCircle(square, imgElement);  // نفس شكل دائرة الحركة حالياً
}

// دالة لتحريك الحصان
function moveHorse(imgElement) {
    const id = parseInt(imgElement.parentElement.id, 10);
    const color = imgElement.getAttribute("data-color");

    const horseMoves = [21, 19, 12, 8, -8, -12, -19, -21];

    removeCircles();

    horseMoves.forEach(move => {
        const targetId = id + move;

        // تأكد أن targetId داخل حدود الرقعة (11 إلى 88)
        if (targetId < 11 || targetId > 88) return;

        // تحقق من الأعمدة لتجنب القفز بين الصفوف (مثلاً من عمود 8 إلى عمود 1)
        const currentColumn = id % 10;
        const targetColumn = targetId % 10;

        // الحركات الأفقية لا يجب أن تقطع الأعمدة بشكل غير منطقي
        if (Math.abs(targetColumn - currentColumn) > 2) return;

        const targetSquare = document.getElementById(targetId);
        if (!targetSquare) return;

        if (targetSquare.innerHTML === "") {
            createMoveCircle(targetSquare, imgElement);
        } else {
            const targetPiece = targetSquare.querySelector("img");
            if (targetPiece && targetPiece.getAttribute("data-color") !== color) {
                createAttackCircle(targetSquare, imgElement);
            }
        }
    });
}

// دالة لتحريك الفيل
function moveElephant(imgElement) {
    const directions = [11, 9, -9, -11]; // الاتجاهات القطرية
    const id = parseInt(imgElement.parentElement.id, 10);
    const color = imgElement.getAttribute("data-color");

    removeCircles();

    directions.forEach(dir => {
        let step = 1;
        while (true) {
            const targetId = id + dir * step;

            if (targetId < 11 || targetId > 88) break;

            const currentColumn = id % 10;
            const targetColumn = targetId % 10;

            // تأكد من عدم تجاوز الأعمدة (تجنب الانتقال من عمود 8 إلى 1 فجأة)
            if (Math.abs(targetColumn - currentColumn) !== step) break;

            const targetSquare = document.getElementById(targetId);
            if (!targetSquare) break;

            if (targetSquare.innerHTML === "") {
                createMoveCircle(targetSquare, imgElement);
            } else {
                const targetPiece = targetSquare.querySelector("img");
                if (targetPiece && targetPiece.getAttribute("data-color") !== color) {
                    createAttackCircle(targetSquare, imgElement);
                }
                break;
            }
            step++;
        }
    });
}


// دالة لتحريك الملك

(function injectCSS() {
    const style = document.createElement("style");
    style.innerHTML = `
        .circle {
            width: 20px;
            height: 20px;
            background-color: red;
            border-radius: 50%;
            position: absolute;
            top: 25px;
            left: 25px;
            z-index: 2;
        }
        .square {
            position: relative;
        }
    `;
    document.head.appendChild(style);
})();
//  تحريك الملك
// دالة نقل القطعة حسب العنصر والمربع الهدف
function placePieceByElement(pieceElement, targetSquare) {
    if (!pieceElement || !targetSquare) return;

    const targetPiece = targetSquare.querySelector("img");

    if (targetPiece && (targetPiece.id === "whiteKing" || targetPiece.id === "blackKing")) {
        const color = targetPiece.id === "whiteKing" ? "الأبيض" : "الأسود";
        alert(`🏁 انتهت اللعبة! الملك ${color} مات!`);
        disableBoard();
        return;
    }

    const currentSquare = pieceElement.parentElement;
    if (currentSquare) {
        currentSquare.innerHTML = "";
    }

    targetSquare.innerHTML = "";
    targetSquare.appendChild(pieceElement);
}

// تعطيل اللوحة بعد انتهاء اللعبة
function disableBoard() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach(square => {
        square.onclick = null;
        const img = square.querySelector("img");
        if (img) img.onclick = null;
    });
}

//  تحريك الملك
function makeTemporaryMove(pieceElement, targetSquare) {
    const originalSquare = pieceElement.parentElement;
    const originalContent = targetSquare.innerHTML;
  
    targetSquare.appendChild(pieceElement);
  
    return {
      revert: () => {
        if (originalSquare) originalSquare.appendChild(pieceElement);
        targetSquare.innerHTML = originalContent;
      }
    };
}
  
// دالة للعثور على موقع الملك
function findKingSquareId(color) {
    const kingId = color === "white" ? "whiteKing" : "blackKing";
    const kingElement = document.getElementById(kingId);
    if (!kingElement || !kingElement.parentElement) return null;
    return parseInt(kingElement.parentElement.id, 10);
}
  
// دالة لتوليد الحركات حسب نوع القطعة - مثال مبسط للجندي والقلعة
function generateMoves(piece) {
    const id = parseInt(piece.parentElement.id, 10);
    const color = piece.dataset.color;
    const type = piece.dataset.type;
  
    let moves = [];
  
    if (type === "pawn") {
      const direction = color === "white" ? 10 : -10;
      const forward = document.getElementById(id + direction);
      if (forward && forward.innerHTML === "") {
        moves.push(id + direction);
      }
      // هجمات قطرياً
      const attackLeft = document.getElementById(id + direction - 1);
      const attackRight = document.getElementById(id + direction + 1);
      if (attackLeft && attackLeft.querySelector("img") && attackLeft.querySelector("img").dataset.color !== color) {
        moves.push(id + direction - 1);
      }
      if (attackRight && attackRight.querySelector("img") && attackRight.querySelector("img").dataset.color !== color) {
        moves.push(id + direction + 1);
      }
    }
  
    if (type === "rook") {
      const directions = [1, -1, 10, -10];
      for (const dir of directions) {
        let step = 1;
        while (true) {
          const targetId = id + dir * step;
          if (targetId < 11 || targetId > 88) break;
          const targetSquare = document.getElementById(targetId);
          if (!targetSquare) break;
  
          const pieceInside = targetSquare.querySelector("img");
          if (!pieceInside) {
            moves.push(targetId);
          } else {
            if (pieceInside.dataset.color !== color) moves.push(targetId);
            break;
          }
          step++;
        }
      }
    }
  
    // باقي القطع ممكن تضاف هون
    return moves;
}
  
// 🔴 تم إلغاء الكش
function isKingInCheck(color) {
    return false; // ما عاد يفحص الكش أبداً
}

  function moveKing(imgElement) {
    clearHighlights();
  
    const id = parseInt(imgElement.parentElement.id, 10);
    const color = imgElement.dataset.color;
    const directions = [10, -10, 1, -1, 11, -11, 9, -9];
  
    directions.forEach(dir => {
      const targetId = id + dir;
      if (targetId < 11 || targetId > 88) return;
  
      const targetSquare = document.getElementById(targetId);
      if (!targetSquare) return;
  
      const row = Math.floor(id / 10);
      const col = id % 10;
      const targetRow = Math.floor(targetId / 10);
      const targetCol = targetId % 10;
  
      if (Math.abs(row - targetRow) <= 1 && Math.abs(col - targetCol) <= 1) {
        const tempMove = makeTemporaryMove(imgElement, targetSquare);
        const inCheck = isKingInCheck(color);
        tempMove.revert();
  
        if (!inCheck) {
          const targetPiece = targetSquare.querySelector("img");
          if (!targetPiece) {
            createMoveCircle(targetSquare, imgElement);
          } else if (targetPiece.dataset.color !== color) {
            createAttackCircle(targetSquare, imgElement);
          }
        }
      }
    });
  }
  

//  حساب المربع المجاور مع معالجة معرف المربع
function getNextSquare(currentId, [dy, dx]) {
    // تأكد إن المعرف مكون من رقمين
    if (currentId.length !== 2) return null;

    // استخراج الصف والعمود بشكل دقيق
    const row = Number(currentId.charAt(0));
    const col = Number(currentId.charAt(1));

    const newRow = row + dy;
    const newCol = col + dx;

    if (newRow >= 1 && newRow <= 8 && newCol >= 1 && newCol <= 8) {
        return `${newRow}${newCol}`;
    }
    return null;
}

//  تمييز المربعات القانونية بحلقة onclick للنقل
function highlightMove(square, pieceElement) {
    const circle = document.createElement("div");
    circle.className = "circle";

    circle.onclick = () => {
        placePieceByElement(pieceElement, square);
        clearHighlights();
    };

    square.appendChild(circle);
}

//  دالة لنقل القطعة إلى مربع جديد
function placePiece(pieceId, targetId) {
    const pieceElement = document.getElementById(pieceId);
    const targetElement = document.getElementById(targetId);

    if (pieceElement && targetElement) {
        const existingPiece = targetElement.querySelector("img");
        if (existingPiece) {
            existingPiece.remove(); // أكل القطعة
        }

        targetElement.innerHTML = ""; // إزالة أي دائرة أو بقايا
        targetElement.appendChild(pieceElement); // نقل القطعة
    }
}

//  إزالة كل الدوائر الحمراء من اللوحة
function clearHighlights() {
    document.querySelectorAll(".circle").forEach(el => el.remove());
}


// دالة لتحريك الوزير
function moveMinister(imgElement) {
    const directions = [10, -10, 1, -1, 11, -11, 9, -9]; // اتجاهات القلعة + الفيل
    const id = parseInt(imgElement.parentElement.id, 10);
    const color = imgElement.getAttribute("data-color");

    removeCircles(); // تنظيف الدوائر القديمة

    directions.forEach(dir => {
        let step = 1;
        while (true) {
            const targetId = id + dir * step;

            // حدود الرقعة
            if (targetId < 11 || targetId > 88) break;

            const currentColumn = id % 10;
            const targetColumn = targetId % 10;

            // منع القفز بين الأعمدة خصوصاً في التحركات الأفقية أو القطرية
            if ((dir === 1 || dir === -1 || dir === 11 || dir === -11 || dir === 9 || dir === -9) &&
                Math.abs(currentColumn - targetColumn) > step) {
                break;
            }

            const targetSquare = document.getElementById(targetId);
            if (!targetSquare) break;

            if (targetSquare.innerHTML === "") {
                createMoveCircle(targetSquare, imgElement); // حركة
            } else {
                const targetPiece = targetSquare.querySelector("img");
                if (targetPiece && targetPiece.getAttribute("data-color") !== color) {
                    createAttackCircle(targetSquare, imgElement); // أكل
                }
                break; // توقف عند أول قطعة (عدو أو صديق)
            }

            step++;
        }
    });
}

