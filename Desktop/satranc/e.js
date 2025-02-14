// دالة لنقل قطعة من مكان إلى آخر
function placePiece(pieceId, targetId) {
    var pieceElement = document.getElementById(pieceId);
    var targetElement = document.getElementById(targetId);

    if (pieceElement && targetElement) {
        targetElement.innerHTML = pieceElement.innerHTML; // نقل القطعة إلى المربع المستهدف
        pieceElement.innerHTML = ""; // إزالة القطعة من مكانها القديم
    }
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
    const id = parseInt(square.id, 10); // الحصول على معرف المربع الحالي

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

            // عند النقر على الدائرة، يتم تحريك القطعة إلى المربع الجديد
            circle.addEventListener("click", function() {
                targetSquare.innerHTML = "";
                targetSquare.appendChild(imgElement);
                removeCircles();
            });
        }
    });

    // إضافة دوائر للهجوم على العدو
    attackDirections.forEach(dir => {
        const targetId = id + dir;
        const targetSquare = document.getElementById(targetId);

        if (targetSquare && targetSquare.innerHTML !== "" && 
            targetSquare.querySelector("img").getAttribute("data-color") !== imgElement.getAttribute("data-color")) {
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

            // عند النقر على الدائرة، يتم قتل العدو وتحريك القطعة إلى مكانه
            circle.addEventListener("click", function() {
                targetSquare.innerHTML = "";
                targetSquare.appendChild(imgElement);
                removeCircles();
            });
        }
    });
}

// دالة لتحريك البيدق
function movePawn(imgElement, color) {
    let directions; // متغير لتخزين الاتجاهات التي يمكن أن يتحرك فيها الجندي
    let attackDirections; // متغير لتخزين الاتجاهات التي يمكن أن يهاجم فيها الجندي

    // تحديد الاتجاهات بناءً على لون الجندي
    if (color === 'white') {
        // الجندي الأبيض يتحرك للأمام باتجاه الصف الأعلى
        directions = [10, 20]; // خطوة واحدة أو خطوتين للأمام
        attackDirections = [9, 11]; // الهجوم يكون بزاويتين للأمام يمينًا أو يسارًا
    } else if (color === 'black') {
        // الجندي الأسود يتحرك للأمام باتجاه الصف الأسفل
        directions = [-10, -20]; // خطوة واحدة أو خطوتين للأمام
        attackDirections = [-9, -11]; // الهجوم يكون بزاويتين للأمام يمينًا أو يسارًا
    }

    // التحقق من صحة الاتجاهات
    if (directions && directions.length > 0) {
        // استدعاء دالة تحريك الجندي
        movePiece(imgElement, directions, attackDirections);
    } else {
        console.error("الاتجاهات غير صحيحة:", directions); // في حال كانت الاتجاهات غير صحيحة
    }
}

// دالة لتحريك القلعة
function moveCastle(imgElement) {
    const directions = [10, 20, 30, 40, 50, 60, 70, -10, -20, -30, -40, -50, -60, -70, 
                        1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -4, -5, -6, -7];
    movePiece(imgElement, directions, []);
}

// دالة لتحريك الحصان
function moveHorse(imgElement) {
    const directions = [19, -19, -21, 21];
    movePiece(imgElement, directions, []);
}

// دالة لتحريك الفيل
function moveElephant(imgElement) {
    const directions = [11, 22, 33, 44, 55, 66, 77, 9, 18, 27, 36, 45, 54, 63, 72,
                        -11, -22, -33, -44, -55, -66, -77, -9, -18, -27, -36, -45, -54, -63, -72];
    movePiece(imgElement, directions, []);
}

// دالة لتحريك الملك
function moveKing(imgElement) {
    const directions = [10, 11, 9, 1, -1, -11, -10, -9];
    movePiece(imgElement, directions, []);
}

// دالة لتحريك الوزير
function moveMinister(imgElement) {
    const directions = [10, 20, 30, 40, 50, 60, 70, 11, 22, 33, 44, 55, 66, 77, 
                        9, 18, 27, 36, 45, 54, 63, 72, -10, -20, -30, -40, -50, -60, -70, 
                        -11, -22, -33, -44, -55, -66, -77, -9, -18, -27, -36, -45, -54, -63, -72];
    movePiece(imgElement, directions, []);
}
