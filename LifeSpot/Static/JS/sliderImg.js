let slider = document.querySelector('.slider'),
    sliderList = slider.querySelector('.slider-list'),
    sliderTrack = slider.querySelector('.slider-track'),
    slides = slider.querySelectorAll('.slide'),
    buttons = slider.querySelector('.slider-arrows'),
    leftButn = buttons.children[0],
    rightButn = buttons.children[1],
    slideWidth = slides[0].offsetWidth,
    slideIndex = 0,
    slideIndexCount = --slides.length,
    posTouch = 0,
    posX1 = 0,
    posX2 = 0,
    posFinal = 0,
    posThreshold = slides[0].offsetWidth * 0.2,
    isSlide = true,
    pxNumer = /([-0-9.]+(?=px))/;


sliderTrack.addEventListener('transitionend', () => isSlide = true);
sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
sliderList.classList.add('grab');

buttons.addEventListener('click', function (e) {
    let target = e.target;

    if (target.classList.contains('rightBut')) {
        slideIndex++;
    } else if (target.classList.contains('leftBut')) {
        slideIndex--;
    } else {
        return;
    }

    slide();
});

function slide() {

    sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;
    sliderTrack.style.transition = 'transform 1s ease-in-out';
    leftButn.classList.toggle('disabled', slideIndex === 0);
    rightButn.classList.toggle('disabled', slideIndex === slideIndexCount);
};

slider.addEventListener('mousedown', swipeStart);

function swipeStart(e) {
    if (isSlide) {
        posTouch = posX1 = e.clientX;
        sliderTrack.style.transition = '';

        document.addEventListener('mousemove', swipeAction);
        document.addEventListener('mouseup', swipeEnd);

        sliderList.classList.remove('grab');
        sliderList.classList.add('grabbing');

    }
};

function swipeAction(e) {

    let transformStyle = sliderTrack.style.transform;
    let transformPx = +transformStyle.match(pxNumer)[0];

    posX2 = posX1 - e.clientX;
    posX1 = e.clientX;

    if (slideIndex === 0) {
        if (posTouch < posX1) {
            isSlide = false;
            return;
        }
    };
    if (slideIndex === slideIndexCount) {
        if (posTouch > posX1) {
            isSlide = false;
            return;
        }
    };
    sliderTrack.style.transform = `translate3d(${transformPx - posX2}px, 0px, 0px)`;

    document.addEventListener('mouseup', swipeEnd);
};

function swipeEnd() {
    document.removeEventListener('mousemove', swipeAction);
    document.removeEventListener('mouseup', swipeEnd);

    sliderList.classList.add('grab');
    sliderList.classList.remove('grabbing');

    posFinal = posTouch - posX1;
    if (isSlide) {
        if (Math.abs(posFinal) > posThreshold) {

            if (posTouch < posX1) {
                slideIndex--;
            } else if (posTouch > posX1) {
                slideIndex++;
            }
        }
        if (posTouch !== posX1) {
            slide();
        }

    } else {
        isSlide = true;
    }
}