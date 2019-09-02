'use strict';

function clickOnDD(btn) {
    let str;
    if (btn === 'classes') {
        str = 'n-c-dd';
    }
    
    const dropdown = document.getElementById(str);

    (dropdown.classList.contains('hidden'))
        ? dropdown.classList.remove('hidden')
        : dropdown.classList.add('hidden');
}