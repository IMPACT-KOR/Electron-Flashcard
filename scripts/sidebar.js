class FolderSystem {
    constructor() {
        this.folders = JSON.parse(localStorage.getItem('folders')) || {
            id: 'root',
            name: 'Root',
            type: 'folder',
            children: [],
            isExpanded: true
        };
    }

    saveToStorage() {
        localStorage.setItem('folders', JSON.stringify(this.folders));
    }

    addFolder(parentId, folderName) {
        const newFolder = {
            id: Date.now().toString(),
            name: folderName,
            type: 'folder',
            children: [],
            isExpanded: false
        };

        const parent = this.findFolder(parentId);
        if (parent) {
            parent.children.push(newFolder);
            this.saveToStorage();
        }
    }

    findFolder(id) {
        const find = (folder) => {
            if (folder.id === id) return folder;
            for (let child of folder.children) {
                const found = find(child);
                if (found) return found;
            }
            return null;
        };
        return find(this.folders);
    }

    deleteFolder(id) {
        const deleteRecursive = (parent) => {
            parent.children = parent.children.filter(child => {
                if (child.id === id) return false;
                deleteRecursive(child);
                return true;
            });
        };
        deleteRecursive(this.folders);
        this.saveToStorage();
    }

    renameFolder(id, newName) {
        const folder = this.findFolder(id);
        if (folder) {
            folder.name = newName;
            this.saveToStorage();
        }
    }

    toggleFolder(id) {
        const folder = this.findFolder(id);
        if (folder) {
            folder.isExpanded = !folder.isExpanded;
            this.saveToStorage();
        }
    }
}

class SidebarUI {
    constructor(folderSystem, rootElement) {
        this.folderSystem = folderSystem;
        this.rootElement = rootElement;
        this.draggedElement = null;
    }

    render() {
        this.rootElement.innerHTML = `
            <div class="sidebar-header">
                <button id="addRootFolderBtn" class="add-root-folder-btn">+ New Folder</button>
            </div>
            <div class="folder-tree">
                ${this.renderFolder(this.folderSystem.folders)}
            </div>
        `;
        this.addEventListeners();
    }

    renderFolder(folder) {
        let html = `
            <div class="folder" data-id="${folder.id}">
                <span class="folder-toggle ${folder.isExpanded ? 'expanded' : ''}">▶</span>
                <span class="folder-name">${folder.name}</span>
                <button class="add-btn">+</button>
                <button class="edit-btn">✎</button>
                <button class="delete-btn">🗑</button>
            </div>
        `;

        if (folder.children.length > 0 && folder.isExpanded) {
            html += '<ul class="subfolder">';
            for (let child of folder.children) {
                html += `<li>${this.renderFolder(child)}</li>`;
            }
            html += '</ul>';
        }

        return html;
    }

    addEventListeners() {
        this.rootElement.addEventListener('click', this.handleClick.bind(this));
        this.rootElement.addEventListener('contextmenu', this.handleContextMenu.bind(this));
        this.rootElement.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.rootElement.addEventListener('dragover', this.handleDragOver.bind(this));
        this.rootElement.addEventListener('drop', this.handleDrop.bind(this));

        // 새 폴더 생성 버튼에 대한 이벤트 리스너 추가
        const addRootFolderBtn = this.rootElement.querySelector('#addRootFolderBtn');
        addRootFolderBtn.addEventListener('click', this.handleAddRootFolder.bind(this));
    }

    handleClick(e) {
        const folderElement = e.target.closest('.folder');
        if (!folderElement) return;

        const folderId = folderElement.dataset.id;

        if (e.target.classList.contains('folder-toggle')) {
            this.folderSystem.toggleFolder(folderId);
            this.render();
        } else if (e.target.classList.contains('add-btn')) {
            const folderName = prompt('Enter new folder name:');
            if (folderName) {
                this.folderSystem.addFolder(folderId, folderName);
                this.render();
            }
        } else if (e.target.classList.contains('edit-btn')) {
            const newName = prompt('Enter new name:');
            if (newName) {
                this.folderSystem.renameFolder(folderId, newName);
                this.render();
            }
        } else if (e.target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this folder?')) {
                this.folderSystem.deleteFolder(folderId);
                this.render();
            }
        }
    }

    handleAddRootFolder() {
        const folderName = prompt('Enter new folder name:');
        if (folderName) {
            this.folderSystem.addFolder(this.folderSystem.folders.id, folderName);
            this.render();
        }
    }
}

export function initializeSidebar() {
    const folderSystem = new FolderSystem();
    const sidebarElement = document.getElementById('sidebar');
    const sidebarUI = new SidebarUI(folderSystem, sidebarElement);
    sidebarUI.render();
}

export function getFolders() {
    const folderSystem = new FolderSystem();
    return folderSystem.folders;
}
