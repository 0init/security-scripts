// Acunetix - Delete All Targets Script
// Usage: Paste in browser console on the Targets page

function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Timeout: element "${selector}" not found`));
        }, timeout);
    });
}

async function deleteAllTargets() {
    // Step 1: Click "Select All" (first mat-checkbox input = header checkbox)
    const selectAll = document.querySelector('mat-checkbox input[type="checkbox"]');
    if (!selectAll) { console.error('Select All checkbox not found'); return false; }
    selectAll.click();
    console.log('Clicked Select All');

    await new Promise(r => setTimeout(r, 800));

    // Step 2: Click "Delete" button (text is "delete Delete" due to Material icon)
    const buttons = document.querySelectorAll('button');
    let clicked = false;
    for (const btn of buttons) {
        if (btn.textContent.trim().endsWith('Delete')) {
            btn.click();
            clicked = true;
            console.log('Clicked Delete');
            break;
        }
    }
    if (!clicked) { console.error('Delete button not found'); return false; }

    // Step 3: Wait for Yes button in confirmation dialog and click it
    try {
        const yesButton = await waitForElement('#btnDialogYes', 5000);
        yesButton.click();
        console.log('Clicked Yes');
        return true;
    } catch (e) {
        console.error('Yes button did not appear:', e.message);
        return false;
    }
}

async function executeWithDelay(iterations, delayInSeconds) {
    for (let i = 0; i < iterations; i++) {
        console.log(`Iteration ${i + 1}/${iterations}`);
        const success = await deleteAllTargets();
        if (!success) {
            console.warn('Iteration failed, retrying next cycle...');
        }
        await new Promise(r => setTimeout(r, delayInSeconds * 1000));
    }
    console.log('Done.');
}

// Run 100 iterations with 10 seconds between each
executeWithDelay(100, 10);
