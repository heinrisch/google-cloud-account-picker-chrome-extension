function save_options_disable() {
    save_options(false);
}

function save_options_enable() {
    save_options(true);
}

function save_options(enabled) {
    chrome.storage.sync.set({
        enabled: enabled,
        authuser: authuserInput.value,
        force: forceInput.checked,
    }, function () {
        const status = document.getElementById('status');
        status.textContent = `Saved and ${enabled ? 'enabled' : 'disabled'}. Refresh page to see changes.`;
        setTimeout(function () {
            status.textContent = '';
        }, 2000);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        enabled: true,
        authuser: 0,
        force: false,
    }, function (items) {
        authuserInput.value = items.authuser;
        forceInput.checked = items.force;
    });
}

const colorPreview = document.getElementById('color-preview');

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save-and-enable').addEventListener('click', save_options_enable);
document.getElementById('disable').addEventListener('click', save_options_disable);


const authuserInput = document.getElementById('input-authuser');
const forceInput = document.getElementById('input-force');
