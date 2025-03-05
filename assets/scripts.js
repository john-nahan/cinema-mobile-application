document.addEventListener('DOMContentLoaded', () => {

    const itemContainer = document.querySelector('.item-container');

    const dateTimes = [
        { date: 'Thu June 21st', time: '16:00' },
        { date: 'Fri June 22nd', time: '18:00' },
        { date: 'Sat June 23rd', time: '20:00' },
        { date: 'Sun June 24th', time: '14:00' },
        { date: 'Mon June 25th', time: '16:00' },
        { date: 'Tue June 26th', time: '18:00' },
        { date: 'Wed June 27th', time: '20:00' },
        { date: 'Thu June 28th', time: '14:00' },
        { date: 'Fri June 29th', time: '16:00' },
        { date: 'Sat June 30th', time: '18:00' }
    ];

    dateTimes.forEach((dateTime, index) => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.setAttribute('data-item-id', index);
        const dateSubstr = dateTime.date.substring(0, 3) + ' ' + dateTime.date.substring(9, 13);
        item.innerHTML = `
            <div class="date">${dateSubstr}</div>
            <div class="time">${dateTime.time}</div>
        `;
        itemContainer.appendChild(item);
    });

    const dots = document.querySelector('#dots');
    const moreText = document.querySelector('#more');
    const btnRead = document.querySelector('#read-more-btn');
    const leftButton = document.querySelector('.left');
    const rightButton = document.querySelector('.right');
    const carouselItems = document.querySelectorAll('.item');
    const reservationBtn = document.querySelector('.reservation-btn button');
    const dateTimeContainer = document.querySelector('.date-time-container');
    const seatsContainer = document.querySelector('.seats-container');
    const ticketsContainer = document.querySelector('.tickets-container');
    const backToDateTimeBtn = document.querySelector('.back-to-date-time');
    const buyBtn = document.querySelector('.buy-btn button');
    const backtoSeatMap = document.querySelector('.back-to-seats-map');
    const vipSeats = document.querySelector('.vip-seats');
    const regSeats = document.querySelector('.reg-seats');
    const totalPrice = document.querySelector('.total');
    const seatMap = document.querySelector('.seat-map');
    const ticketDateTime = document.querySelector('.ticket-date-time');
    const selectedDateTime = document.querySelector('.selected-date-time');
    const selectedSeatsContainer = document.querySelector('.selected-seats');


    let itemWidth = 0;
    let visibleItems = 5;
    const middlePosition = visibleItems / 2;
    let currentIndex = 0;
    const minIndex = 0;
    const maxIndex = dateTimes.length - 1;
    const vipSeatsList = [];
    const regSeatsList = [];
    let total = 0;

    moveSlider(0);

    btnRead.addEventListener('click', () => {
        if (dots.style.display === 'none') {
            dots.style.display = 'inline';
            btnRead.innerHTML = 'read more';
            moreText.style.display = 'none';
        } else {
            dots.style.display = 'none';
            btnRead.innerHTML = 'read less';
            moreText.style.display = 'inline';
        }
    });



    function moveSlider(itemIndex) {
        const step = middlePosition - itemIndex;
        if (window.innerWidth >= 1200) {
            itemWidth = 6;
        }
        else {
            itemWidth = 16;
        }
        const newPosition = itemWidth * step + 'vw';
        
        itemContainer.style.left = newPosition;

        document.querySelectorAll('.date, .time').forEach(el => {
            el.classList.remove('highlighted');
        });

        carouselItems.forEach(element => {
            element.classList.remove('selected', 'next-to-selected');
        });

        carouselItems[currentIndex].classList.add('selected');

        if (currentIndex !== minIndex) {
            carouselItems[currentIndex - 1].classList.add('next-to-selected');
        }

        if (currentIndex !== maxIndex) {
            carouselItems[currentIndex + 1].classList.add('next-to-selected');
        }

        const currentItem = carouselItems[currentIndex];
        currentItem.querySelector('.date').classList.add('highlighted');
        currentItem.querySelector('.time').classList.add('highlighted');
    }

    rightButton.addEventListener('click', () => {
        if (currentIndex === maxIndex) return;
        currentIndex += 1;
        moveSlider(currentIndex);
    });

    leftButton.addEventListener('click', () => {
        if (currentIndex === minIndex) return;
        currentIndex -= 1;
        moveSlider(currentIndex);
    });

    carouselItems.forEach(element => {
        element.addEventListener('click', e => {
            const item = e.target.closest('.item');
            const index = item.dataset.itemId;
            currentIndex = parseInt(index);
            moveSlider(currentIndex);

            document.querySelectorAll('.date, .time').forEach(el => {
                el.classList.remove('highlighted');
            });

            item.querySelector('.date').classList.add('highlighted');
            item.querySelector('.time').classList.add('highlighted');
        });
    });

    reservationBtn.addEventListener('click', () => {
        dateTimeContainer.classList.add('hide');
        seatsContainer.classList.remove('hide');
        updateTicketDateTime()
    });

    backToDateTimeBtn.addEventListener('click', () => {
        dateTimeContainer.classList.remove('hide');
        seatsContainer.classList.add('hide');
        clearSelectedSeats();
    });

    buyBtn.addEventListener('click', () => {
        if (vipSeatsList.length === 0 && regSeatsList.length === 0) {
            alert('Please select tickets to buy!');
        } else {
            seatsContainer.classList.add('hide');
            ticketsContainer.classList.remove('hide');
            finalizeTicketInfo();
        }
    });

    backtoSeatMap.addEventListener('click', () => {
        seatsContainer.classList.remove('hide');
        ticketsContainer.classList.add('hide');
        clearSelectedSeats();
    });

    function clearSelectedSeats() {
        vipSeatsList.length = 0;
        regSeatsList.length = 0;
        total = 0;
        vipSeats.innerHTML = 'Seats ';
        regSeats.innerHTML = 'Seats ';
        totalPrice.innerHTML = 'Total: $0';
        document.querySelectorAll('.seat.selected').forEach(seat => {
            seat.classList.remove('selected');
        });
    }

    function updateTicketDateTime() {
        const selectedDate = dateTimes[currentIndex].date;
        const selectedTime = dateTimes[currentIndex].time;
        ticketDateTime.innerHTML = `
            <div></div>
            <span>${selectedDate}</span>
            <div></div>
            <span>${selectedTime}</span>
        `;
    }

    function finalizeTicketInfo() {
        const selectedDate = dateTimes[currentIndex].date;
        const selectedTime = dateTimes[currentIndex].time;
        const selectedSeats = document.querySelectorAll('.seat.selected');
        selectedSeatsContainer.innerHTML = '';
        const rows = [];
        const seats = [];

        selectedSeats.forEach(seat => {
            const seatRow = seat.getAttribute('data-seat-row');
            let seatId = seat.classList[1];
            if (isNaN(parseInt(seat.classList[1]))) {
                seatId = seat.classList[2];
            } else {
                seatId = seat.classList[1];
            }
            rows.push(parseInt(seatRow) + 1);
            seats.push(seatId);
        });

        const seatInfo = document.createElement('div');
        seatInfo.classList.add('selected-seats');
        seatInfo.innerHTML = `
            <div class="selected-row"><span>Row: ${rows.join(', ')}</span></div>
            <div class="selected-seats"><span>Seats: ${seats.join(', ')}</span></div>
        `;
        selectedSeatsContainer.appendChild(seatInfo);

        selectedDateTime.innerHTML = `
            <div><span>Date: ${selectedDate}</span></div>
            <div><span>Time: ${selectedTime}</span></div>
        `;

    }

    const seatIconHTML = `<svg width="30" height="22" viewBox="0 0 30 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 4C0 2.89543 0.89543 2 2 2H4C5.10457 2 6 2.89543 6 4V14C6 15.1046 6.89543 16 8 16H22C23.1046 16 24 15.1046 24 14V4C24 2.89543 24.8954 2 26 2H28C29.1046 2 30 2.89543 30 4V17C30 19.7614 27.7614 22 25 22H5C2.23858 22 0 19.7614 0 17V4Z"/>
                            <path d="M7 3C7 1.34315 8.34315 0 10 0H20C21.6569 0 23 1.34315 23 3V14C23 14.5523 22.5523 15 22 15H8C7.44772 15 7 14.5523 7 14V3Z"/>
                          </svg>`;
    const seatRows = [6, 8, 8, 9, 9, 9];
    let seatIndex = 0;

    seatRows.forEach((row, index) => {
        const seatRow = document.createElement('div');
        seatRow.classList.add('seat-row');

        for (let i = 0; i < row; i++) {
            const seat = document.createElement('div');
            seat.innerHTML = seatIconHTML;
            seat.classList.add('seat');

            const currentSeat = seatData[seatIndex];

            if (currentSeat.isVip) {
                seat.classList.add('isVip');
            }

            if (!currentSeat.available) {
                seat.classList.add('booked');
            }

            seat.classList.add(currentSeat.id);
            seat.setAttribute('data-seat-row', index);
            seatRow.appendChild(seat);

            seat.addEventListener('click', () => {
                if (currentSeat.available) {
                    seat.classList.toggle('selected');
                    updateSeatSelection(currentSeat, seat);
                } else {
                    alert('This seat is not available now!');
                }
            });

            seatIndex++;
        }

        seatMap.appendChild(seatRow);
    });

    function updateSeatSelection(currentSeat, seat) {
        if (currentSeat.isVip) {
            if (seat.classList.contains('selected')) {
                vipSeatsList.push(currentSeat.id);
                total += currentSeat.price;
            } else {
                const index = vipSeatsList.indexOf(currentSeat.id);
                if (index > -1) {
                    vipSeatsList.splice(index, 1);
                    total -= currentSeat.price;
                }
            }
            vipSeats.innerHTML = `Seats ${vipSeatsList.join(', ')}`;
        } else {
            if (seat.classList.contains('selected')) {
                regSeatsList.push(currentSeat.id);
                total += currentSeat.price;
            } else {
                const index = regSeatsList.indexOf(currentSeat.id);
                if (index > -1) {
                    regSeatsList.splice(index, 1);
                    total -= currentSeat.price;
                }
            }
            regSeats.innerHTML = `Seats ${regSeatsList.join(', ')}`;
        }
        totalPrice.innerHTML = `Total: $${total}`;
    }
});