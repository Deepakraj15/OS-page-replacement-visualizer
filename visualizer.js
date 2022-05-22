
function calculate() {
    const algo = document.querySelector('select').value;
    const inputString = document.querySelector('#input-string').value;
    const framenumber = document.querySelector('#framesize').value;
    switch (algo) {
        case 'fifo':
            fifo(inputString, framenumber);
            break;
        case 'lru':
            lru(inputString, framenumber);
            break;
        case 'optimal':
            optimal(inputString, framenumber);
            break;
    }
}
function fifo(pages, size) {
    let insert = -1;
    var row = document.getElementById('tableID').insertRow(insert)
    let queue = new Array(size + 1)
    let loadedpages = {}
    let pagehits = 0
    let pagefaults = 0
    let baseptr = 0
    for (let page of pages) {
        if (queue[size - 1] == undefined) {
            if (loadedpages[page] == undefined) {
                queue[baseptr] = page
                loadedpages[page] = true
                queue[size] = 'fault'
                pagefaults++
                row = document.getElementById('tableID').insertRow(insert)
                row.insertCell(0).textContent = `${page}`
                row.insertCell(-1).textContent = 'fault'

                baseptr = baseptr == size - 1 ? 0 : baseptr + 1

            }
            else {
                queue[size] = 'hit'
                pagehits++
                row = document.getElementById('tableID').insertRow(insert)
                row.insertCell(0).textContent = `${page}`
                row.insertCell(1).textContent = 'hit'


            }
        }
        else {
            if (loadedpages[page] == undefined) {
                const swappage = queue[baseptr]
                delete loadedpages[swappage]
                queue[baseptr] = page
                loadedpages[page] = true
                queue[size] = 'fault'
                pagefaults++
                row = document.getElementById('tableID').insertRow(insert)
                row.insertCell(0).textContent = `${page}`
                row.insertCell(-1).textContent = 'fault'

                baseptr = baseptr == size - 1 ? 0 : baseptr + 1
            }
            else {
                queue[size] = 'hit'
                row = document.getElementById('tableID').insertRow(insert)
                row.insertCell(0).textContent = `${page}`;
                row.insertCell(1).textContent = 'hit'
                pagehits++
            }
        }
    }
    document.querySelector('.hit').innerHTML = pagehits;
    document.querySelector('.fault').innerHTML = pagefaults;
    document.querySelector('.efficiency').textContent = `${(pagehits / pagefaults) * 100}%`;
    resultDisplay(pagehits, pagefaults)
    resetValues()
}


function optimal(pages, size) {
    let insert = -1;
    var row = document.getElementById('tableID').insertRow(insert)
    let queue = new Array(size + 1)
    let loadedpages = {}
    let pagehits = 0
    let pagefaults = 0
    let baseptr = 0

    for (let pageindex in pages) {
        const page = pages[pageindex]
        if (queue[size - 1] == undefined) {
            if (loadedpages[page] == undefined) {
                queue[baseptr] = page
                loadedpages[page] = baseptr
                pagefaults++
                baseptr++
                queue[size] = 'fault'
                row = document.getElementById('tableID').insertRow(insert)
                row.insertCell(0).textContent = `${page}`
                row.insertCell(-1).textContent = 'fault'
            }
            else {
                pagehits++
                queue[size] = 'hit'
                row = document.getElementById('tableID').insertRow(insert)
                row.insertCell(0).textContent = `${page}`
                row.insertCell(-1).textContent = 'hit'
            }
        }
        else {
            if (loadedpages[page] == undefined) {
                let newarr = pages.slice(pageindex)
                let unusedpage = null
                for (let i = 0; i < size; i++) {
                    if (newarr.indexOf(queue[i]) == -1) {
                        unusedpage = queue[i]
                        break
                    }
                    else {
                        unusedpage = newarr.indexOf(queue[i]) > newarr.indexOf(unusedpage) ? queue[i] : unusedpage
                    }
                }

                baseptr = Number(loadedpages[unusedpage])

                queue[baseptr] = page
                delete loadedpages[unusedpage]
                loadedpages[page] = baseptr
                pagefaults++
                queue[size] = 'fault'
                row = document.getElementById('tableID').insertRow(insert)
                row.insertCell(0).textContent = `${page}`
                row.insertCell(-1).textContent = 'fault'
            }
            else {
                pagehits++
                queue[size] = 'hit'
                row = document.getElementById('tableID').insertRow(insert)
                row.insertCell(0).textContent = `${page}`
                row.insertCell(-1).textContent = 'hit'
            }
        }
    }
    document.querySelector('.hit').innerHTML = pagehits;
    document.querySelector('.fault').innerHTML = pagefaults;
    document.querySelector('.efficiency').textContent = `${(pagehits / pagefaults) * 100}%`;
    resultDisplay(pagehits, pagefaults)
    resetValues()
}
function lru(pages, size) {
    let insert = -1;
    var row = document.getElementById('tableID').insertRow(insert)
    let queue = new Array(size + 1)
    let loadedpages = {}
    let pagehits = 0
    let pagefaults = 0
    let baseptr = 0

    for (let pageindex in pages) {
        const page = pages[pageindex]
        if (queue[size - 1] == undefined) {
            if (loadedpages[page] == undefined) {
                queue[baseptr] = page
                loadedpages[page] = baseptr
                pagefaults++
                baseptr++
                queue[size] = 'fault'
                row = document.getElementById('tableID').insertRow(insert)
                row.insertCell(0).textContent = `${page}`;
                row.insertCell(1).textContent = 'fault'
            }
            else {
                pagehits++
                queue[size] = 'hit'
                row = document.getElementById('tableID').insertRow(insert)
                row.insertCell(0).textContent = `${page}`;
                row.insertCell(1).textContent = 'hit'
            }
        }
        else {
            if (loadedpages[page] == undefined) {
                let newarr = pages.slice(0, pageindex)
                let unusedpage = queue[0]
                for (let i = 1; i < size; i++) {
                    unusedpage = newarr.lastIndexOf(queue[i]) < newarr.lastIndexOf(unusedpage) ? queue[i] : unusedpage
                }

                baseptr = Number(loadedpages[unusedpage])

                queue[baseptr] = page
                delete loadedpages[unusedpage]
                loadedpages[page] = baseptr
                pagefaults++
                queue[size] = 'fault'
                row = document.getElementById('tableID').insertRow(insert)
                row.insertCell(0).textContent = `${page}`;
                row.insertCell(1).textContent = 'fault'
            }
            else {
                pagehits++
                queue[size] = 'hit'
                row = document.getElementById('tableID').insertRow(insert)
                row.insertCell(0).textContent = `${page}`;
                row.insertCell(1).textContent = 'hit'
            }
        }
    }
    resultDisplay(pagehits, pagefaults)
    resetValues()
}
function resetValues() {
    document.querySelector('#input-string').value = '';
    document.querySelector('#framesize').value = 'none';
    document.querySelector('select').value = 'none';
}
function resultDisplay(pagehits, pagefaults) {
    document.getElementById('tableID').style.display = 'block';
    document.querySelector('.hit').innerHTML = pagehits;
    document.querySelector('.fault').innerHTML = pagefaults;
    document.querySelector('.efficiency').textContent = `${Math.round((pagehits / pagefaults) * 100)}%`;
}