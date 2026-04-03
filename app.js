const Characters = [
    {
        id: 'viper_ghost', name: 'Viper Ghost', hp: 350, dmgMult: 1.4,
        passive: { name: 'Siphoner', desc: '+1 Energy on snake', cooldownTime: 0 },
        active: { name: 'Cloak', desc: 'Skip enemy turn', cooldownTime: 3 },
        ultimate: { name: 'Venom', desc: 'DoT 3 turns', cooldownTime: 8 }
    },
    {
        id: 'circuit_breaker', name: 'Circuit Breaker', hp: 450, dmgMult: 1.1,
        passive: { name: 'Override', desc: 'Reroll 1s', cooldownTime: 0 },
        active: { name: 'Shock', desc: 'Freeze ladder', cooldownTime: 3 },
        ultimate: { name: 'Overclock', desc: '2x rolls 2 turns', cooldownTime: 8 }
    },
    {
        id: 'iron_aegis', name: 'Iron Aegis', hp: 650, dmgMult: 0.8,
        passive: { name: 'Plating', desc: '-10% dmg passive', cooldownTime: 0 },
        active: { name: 'Shield Wall', desc: '-35% dmg 2 turns', cooldownTime: 3 },
        ultimate: { name: 'Fortress', desc: 'Immune 1 turn', cooldownTime: 8 }
    },
    {
        id: 'echo_pulse', name: 'Echo Pulse', hp: 500, dmgMult: 1.0,
        passive: { name: 'Generator', desc: '+2 Energy / 3 turns', cooldownTime: 0 },
        active: { name: 'Scan', desc: 'Reveal snake traps', cooldownTime: 3 },
        ultimate: { name: 'Resonance', desc: 'Heal 80 HP', cooldownTime: 8 }
    },
    {
        id: 'void_walker', name: 'Void Walker', hp: 400, dmgMult: 1.2,
        passive: { name: 'Ether', desc: 'Ignore 1 snake/game', cooldownTime: 0 },
        active: { name: 'Phase', desc: 'Teleport ±5', cooldownTime: 3 },
        ultimate: { name: 'Rift', desc: 'Swap w/ Enemy', cooldownTime: 8 }
    }
];

const Settings = {
    fastRoll: false,
    audio: false,
    basicMode: false,
    hideGridLines: false,
    currentSongIdx: 0,
    difficulty: 'medium',
    playlist: [
        { name: "My mum is kinda homeless", src: "my_mum_is_kinda_homeless.mp3" },
        { n: "No Batidão", src: "no_batidao.mp3" },
        { name: "Murder In My Mind - Kordhell", src: "murder_in_my_mind.mp3" },
        { name: "METAMORPHOSIS - INTERWORLD", src: "metamorphosis.mp3" },
        { name: "RAVE - Dxrk ダーク", src: "rave.mp3" },
        { name: "Close Eyes - DVRST", src: "close_eyes.mp3" },
        { name: "NEON BLADE - MoonDeity", src: "neon_blade.mp3" },
        { name: "Sahara - Hensonn", src: "sahara.mp3" },
        { name: "GigaChad Theme - g3ox_em", src: "gigachad_theme.mp3" },
        { name: "9 In My Hand - Kordhell", src: "9_in_my_hand.mp3" },
        { name: "Disaster - KSLV Noh", src: "disaster.mp3" },
        { name: "Override - KSLV Noh", src: "override.mp3" }
    ],

    playSong() {
        let bgm = document.getElementById('bg-music');
        if (!bgm) return;
        bgm.src = this.playlist[this.currentSongIdx].src;
        if (this.audio) {
            bgm.play().catch(e => {
                console.log(e);
                GameState.showNotification("Browser Audio Policy: Click play on a button first!", "danger");
            });
        }
        let lbl = document.getElementById('current-song-lbl');
        if (lbl) lbl.innerText = `Song: ${this.currentSongIdx + 1}/${this.playlist.length}`;
    },

    init() {
        let btn = document.getElementById('btn-settings');
        if(btn) btn.addEventListener('click', () => {
            let ov = document.getElementById('settings-overlay');
            if (ov.classList.contains('hidden')) ov.classList.remove('hidden');
            else ov.classList.add('hidden');
        });
        
        let clsBtn = document.getElementById('close-settings');
        if(clsBtn) clsBtn.addEventListener('click', () => document.getElementById('settings-overlay').classList.add('hidden'));

        let retBtn = document.getElementById('btn-return-menu');
        if(retBtn) retBtn.addEventListener('click', () => {
            document.getElementById('settings-overlay').classList.add('hidden');
            ScreenManager.showMainMenu();
        });

        let fr = document.getElementById('toggle-fast-roll');
        if(fr) fr.addEventListener('change', (e) => this.fastRoll = e.target.checked);
        
        let hl = document.getElementById('toggle-hide-lines');
        if(hl) hl.addEventListener('change', (e) => {
            this.hideGridLines = e.target.checked;
            if (GameState.currentGame === 'Snakes') SnakesGame.draw();
        });

        let nx = document.getElementById('btn-next-song');
        if(nx) nx.addEventListener('click', () => {
            this.currentSongIdx = (this.currentSongIdx + 1) % this.playlist.length;
            this.playSong();
        });

        let aud = document.getElementById('toggle-audio');
        if(aud) aud.addEventListener('change', (e) => {
            this.audio = e.target.checked;
            let bgm = document.getElementById('bg-music');
            if (this.audio) this.playSong(); else bgm.pause();
        });
        
        let perf = document.getElementById('toggle-performance');
        if(perf) perf.addEventListener('change', (e) => {
            this.basicMode = e.target.checked;
            if (this.basicMode) document.body.classList.add('basic-mode');
            else document.body.classList.remove('basic-mode');
        });

        let diff = document.getElementById('select-difficulty');
        if(diff) diff.addEventListener('change', (e) => { this.difficulty = e.target.value; });

        let searchBtn = document.getElementById('btn-dj-search');
        let searchInp = document.getElementById('dj-search-input');
        if(searchBtn && searchInp) {
            searchBtn.addEventListener('click', () => {
                const query = searchInp.value.trim().toLowerCase();
                if(!query) return;
                const status = document.getElementById('dj-status-msg');
                status.innerText = "SCANNING QUANTUM DATABASE...";
                setTimeout(() => {
                    const matches = [
                        { n: "My mum is kinda homeless", src: "my_mum_is_kinda_homeless.mp3" },
                        { n: "No Batidão", src: "no_batidao.mp3" },
                        { n: "Murder In My Mind", src: "murder_in_my_mind.mp3" },
                        { n: "METAMORPHOSIS", src: "metamorphosis.mp3" },
                        { n: "RAVE", src: "rave.mp3" },
                        { n: "Close Eyes", src: "close_eyes.mp3" },
                        { n: "NEON BLADE", src: "neon_blade.mp3" },
                        { n: "Sahara", src: "sahara.mp3" },
                        { n: "GigaChad Theme", src: "gigachad_theme.mp3" },
                        { n: "9 In My Hand", src: "9_in_my_hand.mp3" },
                        { n: "Disaster", src: "disaster.mp3" },
                        { n: "Override", src: "override.mp3" }
                    ];
                    let found = matches.find(m => m.n.toLowerCase().includes(query));
                    if(found) {
                        status.innerText = `FOUND: ${found.n}! ADDING TO DECK...`;
                        this.playlist.push(found);
                        this.currentSongIdx = this.playlist.length - 1;
                        this.playSong();
                        document.getElementById('current-song-lbl').innerText = `Song: ${this.playlist.length}/${this.playlist.length}`;
                    } else {
                        status.innerText = "NO MATCHES FOUND IN SECTOR.";
                    }
                }, 1500);
            });
        }
    }
};

const GameState = {
    mode: '1p', 
    turnMode: 1, 
    currentShopOwner: null,
    currentGame: null,

    player1: null,
    player2: null,
    
    limits: { nanoMed: 2, rocket: 3, plate: 1, emp: 1, stim: 2 },
    listeners: [],
    
    subscribe(listener) { this.listeners.push(listener); },
    notify() { this.listeners.forEach(listener => listener(this)); },

    createPlayerState(character) {
        return {
            character: character,
            hp: character.hp,
            maxHp: character.hp,
            energy: 50,
            inventory: [],
            maxInventory: 3,
            upgrades: [],
            cooldowns: { active: 0, ultimate: 0 },
            activeEffects: [],
            bought: { nanoMed: 0, rocket: 0, plate: 0, emp: 0, stim: 0, superMed: 0, warp: 0 },
            turnSkips: 0,
            usedSecondWind: false,
            extraTurns: 0
        };
    },

    init(p1Char, p2Char, mode, gameConfig) {
        this.mode = mode;
        this.player1 = this.createPlayerState(p1Char);
        this.player2 = this.createPlayerState(p2Char);
        this.turnMode = 1;
        this.notify();
    },

    modifyHP(playerNum, amount) {
        const pState = playerNum === 1 ? this.player1 : this.player2;
        if (!pState) return;

        if (amount < 0) {
            if (pState.character.id === 'iron_aegis') amount = Math.round(amount * 0.9);
            if (pState.inventory.includes('Titanium Plate')) amount = Math.round(amount * 0.85);
            if (pState.activeEffects.find(e => e.name === 'Shield Wall')) amount = Math.round(amount * 0.65);
            if (pState.activeEffects.find(e => e.name === 'Fortress')) {
                amount = 0;
                this.showNotification(`P${playerNum} Damage Immune!`, 'success');
            }
        }

        pState.hp += amount;
        if (pState.hp > pState.maxHp) pState.hp = pState.maxHp;
        
        if (pState.hp < pState.maxHp * 0.25 && pState.hp > 0 && pState.upgrades.includes('Second Wind') && !pState.usedSecondWind) {
            pState.hp += 150;
            if (pState.hp > pState.maxHp) pState.hp = pState.maxHp;
            pState.usedSecondWind = true;
            this.showNotification(`P${playerNum} Second Wind! +150 HP`, 'success');
        }

        if (pState.hp <= 0) {
            pState.hp = 0;
            const loser = playerNum === 1 ? "PLAYER 1" : (this.mode === '1p' ? "ENEMY" : "PLAYER 2");
            this.showNotification(`${loser} DIED!`, 'danger');
            ScreenManager.showModeSelect(); 
        }
        this.notify();
    },

    modifyEnergy(playerNum, amount) {
        const pState = playerNum === 1 ? this.player1 : this.player2;
        if (!pState) return;
        pState.energy += amount;
        if (pState.energy < 0) pState.energy = 0;
        this.notify();
    },

    buyItem(playerNum, id, name, cost, limitKey, isUpgrade=false) {
        const pState = playerNum === 1 ? this.player1 : this.player2;
        if (!isUpgrade && pState.upgrades.includes('Efficiency Core')) cost = Math.max(0, cost - 10);

        if (pState.energy >= cost) {
            if (isUpgrade) {
                if (!pState.upgrades.includes(name)) {
                    pState.energy -= cost;
                    pState.upgrades.push(name);
                    if (name === 'Cargo Extension') pState.maxInventory = 5;
                    this.showNotification(`P${playerNum} activated ${name}`, 'success');
                    this.notify();
                    return true;
                } else {
                    this.showNotification('Upgrade already owned!', 'danger');
                }
            } else {
                if ((pState.bought[limitKey] || 0) < (this.limits[limitKey] || 99) && pState.inventory.length < pState.maxInventory) {
                    pState.energy -= cost;
                    pState.bought[limitKey] = (pState.bought[limitKey] || 0) + 1;
                    pState.inventory.push(name);
                    this.showNotification(`P${playerNum} Bought ${name}`, 'success');
                    this.notify();
                    return true;
                } else if (pState.inventory.length >= pState.maxInventory) {
                    this.showNotification('Inventory Full!', 'danger');
                } else {
                    this.showNotification('Limit reached for item!', 'danger');
                }
            }
        } else {
            this.showNotification('Not enough Energy!', 'danger');
        }
        return false;
    },

    useItem(playerNum, index) {
        const pState = playerNum === 1 ? this.player1 : this.player2;
        const opponent = playerNum === 1 ? this.player2 : this.player1;
        
        if (index >= 0 && index < pState.inventory.length) {
            const item = pState.inventory[index];
            
            // Check TTT alternative uses
            if (this.currentGame === 'TTT') {
                if (item === 'Rocket Boost / TTT Firewall') QuantumTTT.activatePowerup(playerNum, 'Firewall');
                else if (item === 'EMP Override') QuantumTTT.activatePowerup(playerNum, 'EMP');
                else if (item === 'Cyber-Stim / TTT Glitch') QuantumTTT.activatePowerup(playerNum, 'Glitch');
                else {
                    if (item === 'Nano-Med') this.modifyHP(playerNum, 60);
                    if (item === 'Titanium Plate') this.showNotification('Titanium Plate is Passive!', 'info');
                }
                if (item !== 'Titanium Plate') pState.inventory.splice(index, 1);
                this.notify();
                return;
            }

            if (item === 'Nano-Med') {
                this.modifyHP(playerNum, 60);
                this.showNotification(`P${playerNum} Nano-Med +60 HP`, 'success');
            } else if (item === 'Nano-Repair Kit') {
                this.modifyHP(playerNum, 120);
                this.showNotification(`P${playerNum} Nano-Repair Kit +120 HP`, 'success');
            } else if (item === 'Time Warp / TTT Double') {
                pState.extraTurns++;
                this.showNotification(`P${playerNum} Time Warp! Extra Turn active.`, 'success');
            } else if (item === 'Rocket Boost / TTT Firewall') {
                pState.activeEffects.push({name: 'Rocket Boost', duration: 1});
                this.showNotification(`P${playerNum} Rocket Boost!`, 'success');
            } else if (item === 'Titanium Plate') {
                this.showNotification('Titanium Plate is Passive!', 'info');
                return;
            } else if (item === 'EMP Override') {
                opponent.turnSkips += 1;
                this.showNotification(`P${playerNum} used EMP! Opponent skips turn.`, 'success');
            } else if (item === 'Cyber-Stim / TTT Glitch') {
                pState.activeEffects.push({name: 'Stim', duration: 3});
                this.showNotification(`P${playerNum} active Cyber-Stim!`, 'success');
            }
            pState.inventory.splice(index, 1);
            this.notify();
        }
    },

    advanceTurn() {
        const pState = this.turnMode === 1 ? this.player1 : this.player2;
        
        if (pState.extraTurns > 0) {
            pState.extraTurns--;
            this.notify();
            if (this.currentGame === 'TTT') QuantumTTT.updateTurnUI();
            return;
        }

        if (pState.cooldowns.active > 0) pState.cooldowns.active--;
        if (pState.cooldowns.ultimate > 0) pState.cooldowns.ultimate--;

        if (pState.character.id === 'echo_pulse') this.modifyEnergy(this.turnMode, 1); 

        for (let i = pState.activeEffects.length - 1; i >= 0; i--) {
            let effect = pState.activeEffects[i];
            
            if (effect.name === 'Venom') {
                this.modifyHP(this.turnMode === 1 ? 1 : 2, -15);
                this.showNotification(`Venom dealt 15 DMG to P${this.turnMode}`, 'danger');
            }
            if (effect.name === 'Stim') {
                this.modifyEnergy(this.turnMode, 3);
            }

            effect.duration--;
            if (effect.duration <= 0 && effect.name !== 'Titanium Plate') {
                pState.activeEffects.splice(i, 1);
            }
        }
        
        this.toggleTurn();
        this.notify();
    },

    toggleTurn() {
        const nextTurn = this.turnMode === 1 ? 2 : 1;
        const nextState = nextTurn === 1 ? this.player1 : this.player2;
        
        if (nextState.turnSkips > 0) {
            nextState.turnSkips--;
            this.showNotification(`P${nextTurn} turn skipped!`, 'danger');
            // If TTT, we still need to advance again
            if(this.currentGame === 'TTT') {
               setTimeout(()=> { this.advanceTurn(); QuantumTTT.updateTurnUI(); }, 1500); 
            }
        } else {
            this.turnMode = nextTurn;
            if(this.currentGame === 'TTT') setTimeout(() => QuantumTTT.botTurn(), 1000);
        }
    },

    useAbility(playerNum, type) {
        const pState = playerNum === 1 ? this.player1 : this.player2;
        if (!pState) return;
        
        if (type === 'active' && pState.cooldowns.active === 0) {
            pState.cooldowns.active = pState.character.active.cooldownTime;
            this.applyAbilityEffect(playerNum, 'active');
            this.notify();
            return true;
        } else if (type === 'ultimate' && pState.cooldowns.ultimate === 0) {
            pState.cooldowns.ultimate = pState.character.ultimate.cooldownTime;
            this.applyAbilityEffect(playerNum, 'ultimate');
            this.notify();
            return true;
        }
        return false;
    },

    playAbilityAnimation(playerNum, abilityName, type) {
        let container = document.getElementById('ability-anim-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="ability-anim-player">PLAYER ${playerNum}</div>
            <div class="ability-anim-text ${type}">${abilityName}</div>
        `;
        container.classList.remove('hidden');
        
        setTimeout(() => {
            container.classList.add('hidden');
            container.innerHTML = '';
        }, 1500);
    },

    applyAbilityEffect(playerNum, type) {
        const pState = playerNum === 1 ? this.player1 : this.player2;
        const oState = playerNum === 1 ? this.player2 : this.player1;
        const char = pState.character;

        let abilityName = type === 'active' ? char.active.name : char.ultimate.name;
        this.playAbilityAnimation(playerNum, abilityName, type);

        if (type === 'active') {
            this.showNotification(`P${playerNum} used ${char.active.name}!`, 'success');
            if (char.id === 'viper_ghost') oState.turnSkips++;
            else if (char.id === 'circuit_breaker') pState.activeEffects.push({name: 'Shock', duration: 1});
            else if (char.id === 'iron_aegis') pState.activeEffects.push({name: 'Shield Wall', duration: 2});
            else if (char.id === 'echo_pulse') Object.assign(this.currentGame === 'TTT' ? QuantumTTT : SnakesGame, { p1Ignored: true });
            else if (char.id === 'void_walker') pState.activeEffects.push({name: 'Phase', duration: 1});
        } else if (type === 'ultimate') {
            this.showNotification(`P${playerNum} used ${char.ultimate.name}!`, 'success');
            if (char.id === 'viper_ghost') oState.activeEffects.push({name: 'Venom', duration: 3});
            else if (char.id === 'circuit_breaker') pState.activeEffects.push({name: 'Overclock', duration: 2});
            else if (char.id === 'iron_aegis') pState.activeEffects.push({name: 'Fortress', duration: 1});
            else if (char.id === 'echo_pulse') this.modifyHP(playerNum, 80);
            else if (char.id === 'void_walker') pState.activeEffects.push({name: 'Rift', duration: 1});
        }
    },

    showNotification(message, type = 'info') {
        const area = document.getElementById('notification-area');
        if (!area) return;
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.innerText = message;
        area.appendChild(notif);
        setTimeout(() => { if (notif.parentNode) notif.parentNode.removeChild(notif); }, 3000);
    }
};

const HUD = {
    init() {
        GameState.subscribe(() => this.update());
        
        let centerShopBtn = document.getElementById('btn-shop');
        if (centerShopBtn) {
            centerShopBtn.addEventListener('click', () => {
                let n = GameState.turnMode;
                GameState.currentShopOwner = n;
                document.getElementById('shop-title').innerText = `P${n} BLACK MARKET`;
                document.getElementById('shop-overlay').classList.remove('hidden');
            });
        }

        ['1','2'].forEach(p => {
            let n = parseInt(p);
            
            let btnA = document.getElementById(`p${p}-btn-active`);
            let btnU = document.getElementById(`p${p}-btn-ultimate`);
            if(btnA) btnA.addEventListener('click', () => GameState.useAbility(n, 'active'));
            if(btnU) btnU.addEventListener('click', () => GameState.useAbility(n, 'ultimate'));
            
            ['active', 'ultimate', 'passive'].forEach(type => {
                let btn = document.getElementById(`p${p}-btn-${type}`);
                if (!btn) return;
                btn.addEventListener('mouseenter', (e) => {
                    let pState = p === '1' ? GameState.player1 : GameState.player2;
                    if (!pState || !pState.character) return;
                    let ab = pState.character[type];
                    document.getElementById('tt-name').innerText = ab.name;
                    document.getElementById('tt-desc').innerText = ab.desc;
                    if (type === 'passive') {
                        document.getElementById('tt-cd').innerText = 'PASSIVE';
                    } else {
                        let cd = pState.cooldowns[type];
                        document.getElementById('tt-cd').innerText = cd > 0 ? `COOLDOWN: ${cd} TURN(S)` : `READY (CD: ${ab.cooldownTime})`;
                    }
                    let tt = document.getElementById('ability-tooltip');
                    tt.classList.remove('hidden');
                });
                btn.addEventListener('mousemove', (e) => {
                    let tt = document.getElementById('ability-tooltip');
                    let x = e.pageX + 10;
                    let y = e.pageY - 90;
                    if (x + tt.offsetWidth > window.innerWidth) x = window.innerWidth - tt.offsetWidth - 10;
                    if (y < 0) y = e.pageY + 20;
                    tt.style.left = x + 'px';
                    tt.style.top = y + 'px';
                });
                btn.addEventListener('mouseleave', () => {
                    document.getElementById('ability-tooltip').classList.add('hidden');
                });
            });

            for (let i = 0; i < 3; i++) {
                let slot = document.getElementById(`p${p}-inv-${i}`);
                if(slot) slot.addEventListener('click', () => GameState.useItem(n, i));
            }
        });

        let shpBtn = document.getElementById('btn-shop');
        if(shpBtn) shpBtn.addEventListener('click', () => {
            let n = GameState.turnMode;
            GameState.currentShopOwner = n;
            document.getElementById('shop-title').innerText = `P${n} THE BACKPACK`;
            document.getElementById('shop-overlay').classList.remove('hidden');
        });

        // Shop Tabs logic
        document.getElementById('tab-consumables').addEventListener('click', (e) => {
            e.target.classList.add('active');
            document.getElementById('tab-upgrades').classList.remove('active');
            document.getElementById('shop-items-container').classList.remove('hidden');
            document.getElementById('upgrades-items-container').classList.add('hidden');
        });
        document.getElementById('tab-upgrades').addEventListener('click', (e) => {
            e.target.classList.add('active');
            document.getElementById('tab-consumables').classList.remove('active');
            document.getElementById('upgrades-items-container').classList.remove('hidden');
            document.getElementById('shop-items-container').classList.add('hidden');
        });

        document.getElementById('close-shop').addEventListener('click', () => document.getElementById('shop-overlay').classList.add('hidden'));

        document.getElementById('buy-med').addEventListener('click', () => GameState.buyItem(GameState.currentShopOwner, 'nano_med', 'Nano-Med', 20, 'nanoMed'));
        document.getElementById('buy-rocket').addEventListener('click', () => GameState.buyItem(GameState.currentShopOwner, 'rocket', 'Rocket Boost / TTT Firewall', 30, 'rocket'));
        document.getElementById('buy-plate').addEventListener('click', () => GameState.buyItem(GameState.currentShopOwner, 'plate', 'Titanium Plate', 50, 'plate'));
        document.getElementById('buy-emp').addEventListener('click', () => GameState.buyItem(GameState.currentShopOwner, 'emp', 'EMP Override', 40, 'emp'));
        document.getElementById('buy-stim').addEventListener('click', () => GameState.buyItem(GameState.currentShopOwner, 'stim', 'Cyber-Stim / TTT Glitch', 35, 'stim'));

        document.getElementById('buy-upg-wind').addEventListener('click', () => GameState.buyItem(GameState.currentShopOwner, 'upg_wind', 'Second Wind', 80, '', true));
        document.getElementById('buy-upg-core').addEventListener('click', () => GameState.buyItem(GameState.currentShopOwner, 'upg_core', 'Efficiency Core', 75, '', true));
        document.getElementById('buy-upg-mom').addEventListener('click', () => GameState.buyItem(GameState.currentShopOwner, 'upg_mom', 'Momentum', 90, '', true));
    },

    update() {
        if (!GameState.player1) return;
        if(document.getElementById('shop-energy')) document.getElementById('shop-energy').innerText = GameState.currentShopOwner === 1 ? GameState.player1.energy : (GameState.player2 ? GameState.player2.energy : 0);

        [1, 2].forEach(pNum => {
            const state = pNum === 1 ? GameState.player1 : GameState.player2;
            
            let hpText = document.getElementById(`p${pNum}-hp-text`);
            if(hpText) hpText.innerText = `${state.hp}/${state.maxHp}`;
            let hpFill = document.getElementById(`p${pNum}-hp-fill`);
            if(hpFill) hpFill.style.width = `${(state.hp / state.maxHp) * 100}%`;
            let egText = document.getElementById(`p${pNum}-energy-text`);
            if(egText) egText.innerText = state.energy;
            
            for (let i = 0; i < 3; i++) {
                const slot = document.getElementById(`p${pNum}-inv-${i}`);
                if (!slot) continue;
                slot.innerHTML = '';
                if (i < state.inventory.length) {
                    let text = '?';
                    let item = state.inventory[i];
                    if (item.includes('Nano-Med')) text = '💉';
                    else if (item.includes('Rocket Boost')) text = '🚀';
                    else if (item.includes('Titanium Plate')) text = '🛡️';
                    else if (item.includes('EMP')) text = '🧨';
                    else if (item.includes('Stim')) text = '🔋';
                    slot.innerText = text;
                }
            }
            
            this.updateBtn(pNum, 'active', state.character.active.name, state.cooldowns.active, state.character.active.cooldownTime);
            this.updateBtn(pNum, 'ultimate', state.character.ultimate.name, state.cooldowns.ultimate, state.character.ultimate.cooldownTime);
            let psText = document.getElementById(`p${pNum}-name-passive`);
            if(psText) psText.innerText = state.character.passive.name;

            let hud = document.getElementById(`p${pNum}-hud`);
            if (hud) {
                if (GameState.turnMode === pNum) hud.classList.remove('inactive-turn');
                else hud.classList.add('inactive-turn');
            }
        });
    },

    updateBtn(pNum, type, name, currentCd, maxCd) {
        const btn = document.getElementById(`p${pNum}-btn-${type}`);
        if (!btn) return;
        const nameSpan = document.getElementById(`p${pNum}-name-${type}`);
        const overlay = document.getElementById(`p${pNum}-cd-${type}`);
        
        nameSpan.innerText = name;
        if (currentCd > 0) {
            btn.classList.add('on-cooldown');
            btn.classList.remove('ready');
            overlay.style.height = `${(currentCd / maxCd) * 100}%`;
        } else {
            btn.classList.remove('on-cooldown');
            btn.classList.add('ready');
            overlay.style.height = '0%';
        }
    }
};

const QuantumTTT = {
    grid: Array(16).fill(null), // null, {p: 1/2, locked: bool}, 'void'
    activePowerup: null, // {pNum, type}
    turnCounter: 0,
    lastReplacedIdx: -1,
    container: null,

    init() {
        GameState.currentGame = 'TTT';
        this.grid = Array(16).fill(null);
        this.activePowerup = null;
        this.turnCounter = 0;
        this.lastReplacedIdx = -1;
        
        GameState.player1.energy = 50;
        GameState.player2.energy = 50;
        GameState.notify();

        document.getElementById('screen-container').innerHTML = `
            <div class="game-area" style="display:flex; flex-direction:column; align-items:center; transform: scale(0.9);">
                <div class="turn-indicator" id="ttt-turn-indicator" style="margin-bottom: 20px;"></div>
                <div id="ttt-grid" class="ttt-container"></div>
                <div id="ttt-powerup-status" style="margin-top: 20px; font-size: 20px; color: var(--neon-cyan); min-height: 30px;"></div>
            </div>
        `;
        
        this.container = document.getElementById('ttt-grid');
        this.renderGrid();
        this.updateTurnUI();
    },

    renderGrid(animIdx = -1) {
        this.container.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            let el = document.createElement('div');
            el.className = 'ttt-cell';
            
            let cell = this.grid[i];
            
            // AI Highlighter Logic
            if (GameState.turnMode === 1 && GameState.player1.upgrades.includes('AI Tactical Uplink')) {
                const best = this.getBestMove(this.grid, 1);
                if (i === best) el.classList.add('ai-hint');
            }

            if (cell === 'void') {
                el.classList.add('void');
                el.innerText = 'X';
            } else if (cell) {
                el.innerText = cell.p === 1 ? 'X' : 'O';
                el.classList.add(cell.p === 1 ? 'p1-mark' : 'p2-mark');
                if (cell.locked) el.classList.add('locked');
            }
            if (animIdx === i && !Settings.basicMode) el.classList.add('pop');
            
            el.addEventListener('click', () => this.cellClick(i));
            this.container.appendChild(el);
        }
    },


    updateTurnUI() {
        let ind = document.getElementById('ttt-turn-indicator');
        if (!ind) return;
        if(GameState.turnMode === 1) {
            ind.innerText = "PLAYER 1 TURN";
            ind.style.color = "var(--neon-cyan)";
        } else {
            ind.innerText = GameState.mode === '1p' ? "ENEMY TURN" : "PLAYER 2 TURN";
            ind.style.color = "var(--neon-red)";
        }
    },

    activatePowerup(pNum, type) {
        if (GameState.turnMode !== pNum) {
            GameState.showNotification("Not your turn!");
            return;
        }
        
        if (type === 'Glitch') {
            GameState.showNotification(`P${pNum} activated Glitch Shift! Board Rotated.`, 'success');
            let newGrid = Array(16).fill(null);
            // Rotates visually: top row moves right, right col moves down, etc. (Simple circular shift for array idx)
            for(let i=0; i<16; i++) newGrid[(i+1)%16] = this.grid[i];
            this.grid = newGrid;
            this.renderGrid();
            this.checkWin();
            return;
        }

        this.activePowerup = { pNum, type };
        document.getElementById('ttt-powerup-status').innerText = `POWERUP ACTIVE: Select a tile for ${type}...`;
    },

    cellClick(idx) {
        let pNum = GameState.turnMode;
        if (GameState.mode === '1p' && pNum === 2) return; // bot plays
        
        this.executeMove(idx, pNum);
    },

    executeMove(idx, pNum) {
        let cell = this.grid[idx];
        if (cell === 'void') return;

        // Active Powerup specific action
        if (this.activePowerup) {
            let { type } = this.activePowerup;
            if (type === 'EMP') {
                if (cell && cell.p !== pNum) {
                    this.grid[idx] = null;
                    GameState.showNotification('Opponent Mark EMP\'d!', 'success');
                    this.clearPowerup();
                    this.renderGrid();
                } else GameState.showNotification('Select an opponent mark to EMP.');
                return;
            }
            if (type === 'Firewall') {
                if (!cell || (cell.p !== pNum)) {
                    this.grid[idx] = { p: pNum, locked: true };
                    GameState.showNotification('Firewall Lock placed!', 'success');
                    this.clearPowerup();
                    this.finalizeTurn(idx);
                } else GameState.showNotification('Cannot firewall there!');
                return;
            }
        }

        if (cell) {
            if (cell.p === pNum) return; 
            if (cell.locked) {
                GameState.showNotification("Tile is Firewalled. Cannot overwrite.");
                return;
            }
            
            let isFull = this.grid.every(c => c !== null);
            let state = pNum === 1 ? GameState.player1 : GameState.player2;
            let cost = isFull ? 0 : 15;
            
            if (isFull && this.lastReplacedIdx === idx) {
                GameState.showNotification("Cannot immediately re-overwrite the same tile!");
                return;
            }

            if (state.energy >= cost) {
                if (cost > 0) GameState.modifyEnergy(pNum, -cost);
                this.grid[idx] = { p: pNum, locked: false };
                this.lastReplacedIdx = idx;
                GameState.showNotification(isFull ? `P${pNum} Free Overwrite!` : `P${pNum} Overwrote Tile! (-15 E)`);
                this.finalizeTurn(idx);
            } else {
                GameState.showNotification("Not enough Energy to Overwrite (15 E required).");
            }
        } else {
            this.grid[idx] = { p: pNum, locked: false };
            this.lastReplacedIdx = -1;
            this.finalizeTurn(idx);
        }
    },
    
    clearPowerup() {
        this.activePowerup = null;
        document.getElementById('ttt-powerup-status').innerText = '';
    },

    finalizeTurn(animIdx) {
        this.renderGrid(animIdx);
        if (this.checkWin()) return;
        
        this.turnCounter++;
        if (this.turnCounter % 3 === 0) {
            GameState.modifyEnergy(1, 15);
            GameState.modifyEnergy(2, 15);
            GameState.showNotification("Universal Charge: Both players receive +15 Energy!", "success");
            GameState.notify();
        }

        if (this.turnCounter % 4 === 0) {
            let empty = [];
            for (let i=0; i<16; i++) if(!this.grid[i]) empty.push(i);
            if (empty.length > 0) {
                let v = empty[Math.floor(Math.random() * empty.length)];
                this.grid[v] = 'void';
                GameState.showNotification("Quantum Shift! Cell collapsed to Void.", 'danger');
                this.renderGrid();
            }
        }
        
        GameState.advanceTurn();
        this.updateTurnUI();
    },

    checkWin() {
        // 4x4 winning lines
        const lines = [
            [0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15],
            [0,4,8,12], [1,5,9,13], [2,6,10,14], [3,7,11,15],
            [0,5,10,15], [3,6,9,12]
        ];
        
        for (let l of lines) {
            let p = null;
            if (this.grid[l[0]] && this.grid[l[0]] !== 'void') p = this.grid[l[0]].p;
            if (p && this.grid[l[1]] && this.grid[l[1]] !== 'void' && this.grid[l[1]].p === p &&
                     this.grid[l[2]] && this.grid[l[2]] !== 'void' && this.grid[l[2]].p === p &&
                     this.grid[l[3]] && this.grid[l[3]] !== 'void' && this.grid[l[3]].p === p) {
                
                let dmg = Math.round(300 * (p === 1 ? GameState.player1.character.dmgMult : GameState.player2.character.dmgMult));
                GameState.modifyHP(p === 1 ? 2 : 1, -dmg);
                
                if (!Settings.basicMode) {
                    this.container.classList.add('win-pulse');
                    document.body.classList.add('shake');
                    setTimeout(() => {
                        this.container.classList.remove('win-pulse');
                        document.body.classList.remove('shake');
                    }, 1500);
                }

                setTimeout(() => ScreenManager.showRoundConclusion(p, dmg), 1500);
                return true;
            }
        }
        return false;
    },

    botTurn() {
        if (GameState.mode !== '1p' || GameState.turnMode !== 2) return;
        
        let best = this.getBestMove(this.grid, 2);
        if (best !== -1) {
            this.executeMove(best, 2);
        }
    },

    getBestMove(grid, pNum) {
        let bestScore = -Infinity;
        let move = -1;
        const available = [];
        for (let i = 0; i < 16; i++) if (!grid[i]) available.push(i);
        
        if (available.length === 16) return 5;

        for (let i of available) {
            let tempGrid = JSON.parse(JSON.stringify(grid));
            tempGrid[i] = { p: pNum, locked: false };
            let depth = Settings.difficulty === 'hard' ? 5 : (Settings.difficulty === 'medium' ? 3 : 1);
            let score = this.minimax(tempGrid, 0, false, -Infinity, Infinity, pNum, depth);
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
        return move;
    },

    minimax(grid, depth, isMaximizing, alpha, beta, pNum, maxD) {
        let winner = this.evaluateBoard(grid);
        if (winner === pNum) return 10 - depth;
        if (winner && winner !== pNum) return -10 + depth;
        if (depth >= maxD || grid.every(c => c !== null)) return 0;

        const opp = pNum === 1 ? 2 : 1;
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 16; i++) {
                if (!grid[i]) {
                    grid[i] = { p: pNum, locked: false };
                    let score = this.minimax(grid, depth + 1, false, alpha, beta, pNum);
                    grid[i] = null;
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, bestScore);
                    if (beta <= alpha) break;
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 16; i++) {
                if (!grid[i]) {
                    grid[i] = { p: opp, locked: false };
                    let score = this.minimax(grid, depth + 1, true, alpha, beta, pNum);
                    grid[i] = null;
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, bestScore);
                    if (beta <= alpha) break;
                }
            }
            return bestScore;
        }
    },

    evaluateBoard(grid) {
        const lines = [
            [0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15],
            [0,4,8,12], [1,5,9,13], [2,6,10,14], [3,7,11,15],
            [0,5,10,15], [3,6,9,12]
        ];
        for (let l of lines) {
            let p = null;
            if (grid[l[0]] && grid[l[0]] !== 'void') p = grid[l[0]].p;
            if (p && grid[l[1]] && grid[l[1]].p === p && grid[l[2]] && grid[l[2]].p === p && grid[l[3]] && grid[l[3]].p === p) return p;
        }
        return null;
    }
};

const SnakesGame = {
    canvas: null, ctx: null, rollBtn: null, diceText: null, turnInd: null,
    started: false,
    player1Pos: 1, player2Pos: 1, cellWidth: 100, cellHeight: 60,
    snakes: [[98,28], [87,24], [62,18], [48,26], [32,10], [92,51]],
    ladders: [[2,38], [8,31], [21,42], [28,84], [36,44], [51,67], [71,91]],
    energyCells: [], mysteryCells: [],
    p1Ignored: false, p2Ignored: false,
    glitchOffsets: [],
    
    init() {
        GameState.currentGame = 'Snakes';
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.cellWidth = this.canvas.width / 10;
        this.cellHeight = this.canvas.height / 10;
        this.rollBtn = document.getElementById('roll-dice-btn');
        this.diceText = document.getElementById('dice-result');
        this.turnInd = document.getElementById('turn-indicator');
        
        this.player1Pos = 1; this.player2Pos = 1;
        this.p1Ignored = false; this.p2Ignored = false;
        
        this.energyCells = [];
        this.mysteryCells = [];
        this.glitchOffsets = this.snakes.map(() => ({ x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 }));
        
        this.snakePoints = this.snakes.map((s) => {
            let start = this.getPos(s[0]);
            let end = this.getPos(s[1]);
            let dx = end.x - start.x; let dy = end.y - start.y;
            return [
                {x: start.x + dx*0.33 + (Math.random()-0.5)*50, y: start.y + dy*0.33 + (Math.random()-0.5)*50},
                {x: start.x + dx*0.66 + (Math.random()-0.5)*50, y: start.y + dy*0.66 + (Math.random()-0.5)*50}
            ];
        });
        
        let avoid = new Set([1, 100]);
        this.snakes.forEach(s => { avoid.add(s[0]); avoid.add(s[1]); });
        this.ladders.forEach(l => { avoid.add(l[0]); avoid.add(l[1]); });
        
        while(this.energyCells.length < 20) {
            let r = Math.floor(Math.random() * 98) + 2;
            if (!avoid.has(r) && !this.energyCells.includes(r)) this.energyCells.push(r);
        }
        while(this.mysteryCells.length < 8) {
            let r = Math.floor(Math.random() * 98) + 2;
            if (!avoid.has(r) && !this.energyCells.includes(r) && !this.mysteryCells.includes(r)) this.mysteryCells.push(r);
        }

        this.rollBtn.onclick = () => this.rollDice();
        this.started = true;
        this.rollBtn.disabled = false;
        
        this.updateTurnUI();
        this.draw();
    },

    updateTurnUI() {
        if(GameState.turnMode === 1) {
            this.turnInd.innerText = "PLAYER 1 TURN";
            this.turnInd.style.color = "var(--neon-cyan)";
        } else {
            this.turnInd.innerText = GameState.mode === '1p' ? "ENEMY TURN" : "PLAYER 2 TURN";
            this.turnInd.style.color = "var(--neon-red)";
        }
    },

    getPos(tile) {
        tile = Math.max(1, Math.min(100, tile));
        let z = tile - 1;
        let r = Math.floor(z / 10);
        let c = z % 10;
        if (r % 2 !== 0) c = 9 - c; 
        return { x: c * this.cellWidth + this.cellWidth / 2, y: (9 - r) * this.cellHeight + this.cellHeight / 2 };
    },

    draw() {
        if (!this.started || GameState.currentGame !== 'Snakes') return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const t = performance.now() / 1000;

        // Remove dark squares to let notebook paper show through!
        /*
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                this.ctx.fillStyle = (i + j) % 2 === 0 ? 'rgba(25,25,35,0.9)' : 'rgba(35,35,45,0.9)';
                this.ctx.fillRect(j * this.cellWidth, i * this.cellHeight, this.cellWidth, this.cellHeight);
            }
        }
        */
        
        if (!Settings.hideGridLines) {
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'; // light faint grid lines
            this.ctx.lineWidth = 1;
            for (let i = 0; i <= 10; i++) {
                this.ctx.beginPath(); this.ctx.moveTo(i*this.cellWidth, 0); this.ctx.lineTo(i*this.cellWidth, this.canvas.height); this.ctx.stroke();
                this.ctx.beginPath(); this.ctx.moveTo(0, i*this.cellHeight); this.ctx.lineTo(this.canvas.width, i*this.cellHeight); this.ctx.stroke();
            }
        }

        this.ctx.fillStyle = '#444';
        this.ctx.font = 'bold 22px "Patrick Hand"';
        this.ctx.textAlign = 'left';
        for (let i = 1; i <= 100; i++) {
            let pos = this.getPos(i);
            this.ctx.fillText(i, pos.x - this.cellWidth/2 + 5, pos.y - this.cellHeight/2 + 20);
        }

        this.ctx.font = '16px "Patrick Hand"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Draw Snakes as Pencils
        this.snakes.forEach((s) => {
            let start = this.getPos(s[0]);
            let end = this.getPos(s[1]);
            
            let dx = end.x - start.x; let dy = end.y - start.y;
            let len = Math.sqrt(dx*dx+dy*dy);
            let angle = Math.atan2(dy, dx);
            
            this.ctx.save();
            this.ctx.translate(start.x, start.y);
            this.ctx.rotate(angle);
            
            let pw = 16;
            
            // Wooden body
            this.ctx.fillStyle = '#f1c40f'; // yellow pencil
            this.ctx.fillRect(0, -pw/2, len - 20, pw);
            this.ctx.strokeStyle = '#e67e22';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath(); this.ctx.moveTo(0, -pw/4); this.ctx.lineTo(len-20, -pw/4); this.ctx.stroke();
            this.ctx.beginPath(); this.ctx.moveTo(0, pw/4); this.ctx.lineTo(len-20, pw/4); this.ctx.stroke();
            // Eraser tip (at start)
            this.ctx.fillStyle = '#fadbd8';
            this.ctx.fillRect(-15, -pw/2, 15, pw);
            this.ctx.fillStyle = '#aeb6bf'; // metal band
            this.ctx.fillRect(0, -pw/2, 5, pw);
            
            // Pencil tip (at end)
            this.ctx.fillStyle = '#f5cba7'; // wood tip
            this.ctx.beginPath();
            this.ctx.moveTo(len-20, -pw/2);
            this.ctx.lineTo(len, 0);
            this.ctx.lineTo(len-20, pw/2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#333'; // graphite
            this.ctx.beginPath();
            this.ctx.moveTo(len-5, -pw/8);
            this.ctx.lineTo(len, 0);
            this.ctx.lineTo(len-5, pw/8);
            this.ctx.fill();
            
            this.ctx.restore();
            
            this.ctx.font = 'bold 16px "Patrick Hand"';
            this.ctx.fillStyle = '#cc0000';
            this.ctx.fillText(`Drop to ${s[1]}`, start.x, start.y + 20);
        });

        // Draw Ladders as Rulers
        this.ladders.forEach(l => {
            let start = this.getPos(l[0]);
            let end = this.getPos(l[1]);
            
            let dx = end.x - start.x; let dy = end.y - start.y;
            let len = Math.sqrt(dx*dx+dy*dy);
            let angle = Math.atan2(dy, dx);
            
            this.ctx.save();
            this.ctx.translate(start.x, start.y);
            this.ctx.rotate(angle);
            
            let width = 24;
            
            // Ruler body
            this.ctx.fillStyle = '#d4efdf'; // light greenish blue plastic ruler
            this.ctx.fillRect(0, -width/2, len, width);
            this.ctx.strokeStyle = '#222';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(0, -width/2, len, width);
            
            // Ruler ticks
            this.ctx.fillStyle = '#222';
            for (let i = 5; i < len; i += 7) {
                let tickLen = (i % 35 === 5) ? 10 : 5;
                this.ctx.fillRect(i, -width/2, 1, tickLen);
            }
            
            this.ctx.restore();
            
            this.ctx.font = 'bold 16px "Patrick Hand"';
            this.ctx.fillStyle = '#008800';
            this.ctx.fillText(`Climb to ${l[1]}`, start.x, start.y + 20);
        });

        this.ctx.fillStyle = '#0000aa'; // Blue pen
        this.ctx.font = 'bold 24px "Patrick Hand"';
        this.energyCells.forEach(e => {
            let p = this.getPos(e);
            this.ctx.fillText('⚡', p.x, p.y + Math.sin(t*4)*3);
        });

        this.ctx.fillStyle = '#cc0000'; // red marker
        this.mysteryCells.forEach(m => {
            let p = this.getPos(m);
            this.ctx.fillText('❓', p.x, p.y + Math.cos(t*4)*3);
        });

        // Draw players as rough hand-drawn circles
        let p1Pos = this.getPos(this.player1Pos);
        this.ctx.strokeStyle = '#0000aa'; 
        this.ctx.lineWidth = 3;
        this.ctx.beginPath(); this.ctx.arc(p1Pos.x - 10, p1Pos.y, 14, 0, Math.PI*2); this.ctx.stroke();
        this.ctx.fillStyle = 'rgba(0,0,170,0.3)'; this.ctx.fill();

        let p2Pos = this.getPos(this.player2Pos);
        this.ctx.strokeStyle = '#cc0000';
        this.ctx.beginPath(); this.ctx.arc(p2Pos.x + 10, p2Pos.y, 14, 0, Math.PI*2); this.ctx.stroke();
        this.ctx.fillStyle = 'rgba(204,0,0,0.3)'; this.ctx.fill();
        
        requestAnimationFrame(() => this.draw());
    },

    rollFor(pNum) {
        let state = pNum === 1 ? GameState.player1 : GameState.player2;
        let roll = Math.floor(Math.random() * 6) + 1;
        
        if (roll === 1 && state.character.id === 'circuit_breaker') {
            roll = Math.floor(Math.random() * 6) + 1;
            GameState.showNotification(`P${pNum} Override: Rerolled 1`, 'success');
        }
        if (state.activeEffects.find(e => e.name === 'Rocket Boost')) {
            roll += 3; GameState.showNotification(`P${pNum} Rocket: +3`, 'success');
        } 
        if (state.activeEffects.find(e => e.name === 'Overclock')) {
            let r2 = Math.floor(Math.random() * 6) + 1;
            roll += r2; GameState.showNotification(`P${pNum} Overclock: ${roll-r2}+${r2}`, 'success');
        }
        if (state.upgrades.includes('Momentum')) {
            roll += 1; GameState.showNotification(`P${pNum} Momentum: +1`, 'success');
        }
        return roll;
    },

    async rollDice() {
        if(GameState.player1.turnSkips > 0 && GameState.turnMode === 1) { GameState.advanceTurn(); return; }
        if(GameState.player2.turnSkips > 0 && GameState.turnMode === 2) { GameState.advanceTurn(); return; }

        this.rollBtn.disabled = true;
        let curP = GameState.turnMode;
        
        let roll = this.rollFor(curP);
        this.diceText.innerText = roll;
        await this.moveToken(roll, curP);
        GameState.advanceTurn(); 
        
        this.updateTurnUI();

        if (GameState.mode === '1p' && GameState.turnMode === 2) {
            setTimeout(() => this.execBotTurn(), 1000);
        } else {
            this.rollBtn.disabled = false;
            if (GameState.player1.upgrades.includes('AI Tactical Uplink')) this.getPrediction();
            if ((GameState.turnMode === 1 && GameState.player1.turnSkips > 0) || (GameState.turnMode === 2 && GameState.player2.turnSkips > 0)) {
                setTimeout(() => { this.rollBtn.click(); }, 1000);
            }
        }
    },

    getPrediction() {
        let label = document.getElementById('sal-predict-label');
        if (!label) return;
        let roll = Math.floor(Math.random() * 6) + 1; // Purely visual "prediction"
        let min = Math.max(1, roll - 1);
        let max = Math.min(6, roll + 1);
        label.innerText = `AI PREDICTION RANGE: ${min} - ${max}`;
    },

    async botStrategy() {
        if (Settings.difficulty === 'easy') return;
        let state = GameState.player2;
        
        // Strategy: Buy Rocket if within 4-9 cells of a ladder
        let laddersInRange = this.ladders.filter(l => l[0] > this.player2Pos + 3 && l[0] < this.player2Pos + 10);
        if (laddersInRange.length > 0 && state.energy >= 30 && !state.activeEffects.find(e => e.name === 'Rocket Boost')) {
            GameState.buyItem(2, 'rocket', 'Rocket Boost / TTT Firewall', 30, 'rocket');
            setTimeout(() => GameState.useItem(2, state.inventory.indexOf('Rocket Boost / TTT Firewall')), 500);
        }

        // Strategy: Buy Med if low HP
        if (state.hp < 150 && state.energy >= 60) {
            GameState.buyItem(2, 'superMed', 'Nano-Repair Kit', 60, 'superMed');
            setTimeout(() => GameState.useItem(2, state.inventory.indexOf('Nano-Repair Kit')), 500);
        }
    },

    async execBotTurn() {
        if (GameState.player1.hp <= 0 || GameState.player2.hp <= 0) return;
        
        await this.botStrategy();
        
        if(GameState.player2.turnSkips > 0) {
            GameState.advanceTurn();
            this.updateTurnUI();
            this.rollBtn.disabled = false;
            return;
        }

        let roll = this.rollFor(2);
        this.diceText.innerText = roll;
        await this.moveToken(roll, 2);
        GameState.advanceTurn();
        this.updateTurnUI();
        this.rollBtn.disabled = false;
    },

    async moveToken(steps, pNum) {
        return new Promise(resolve => {
            let current = pNum === 1 ? this.player1Pos : this.player2Pos;
            
            if (Settings.fastRoll) {
                current += steps;
                if (current > 100) current = 100 - (current - 100);
                if (pNum === 1) this.player1Pos = current; else this.player2Pos = current;
                let cidx = this.energyCells.indexOf(current);
                if (cidx > -1) {
                    this.energyCells.splice(cidx, 1);
                    GameState.modifyEnergy(pNum, 10);
                }
                this.checkLaddersAndSnakes(current, pNum).then(() => resolve());
                return;
            }

            let count = 0;
            let iv = setInterval(() => {
                count++; current++;
                if (current > 100) current = 100 - (current - 100);
                
                if (pNum === 1) this.player1Pos = current; else this.player2Pos = current;
                
                let cidx = this.energyCells.indexOf(current);
                if (cidx > -1) {
                    this.energyCells.splice(cidx, 1);
                    GameState.modifyEnergy(pNum, 10);
                }
                
                if (count >= steps) {
                    clearInterval(iv);
                    this.checkLaddersAndSnakes(current, pNum).then(() => resolve());
                }
            }, 300);
        });
    },

    triggerMystery(pNum) {
        const abilities = [
            { n: 'Orbital Strike', d: 'Deals 60 DMG to the opponent', f: () => { GameState.modifyHP(pNum === 1 ? 2 : 1, -60); } },
            { n: 'Quantum Leap', d: 'Teleports you 8 spaces forward', f: () => { 
                let newPos = (pNum === 1 ? this.player1Pos : this.player2Pos) + 8;
                if (newPos > 100) newPos = 100 - (newPos - 100);
                if (pNum === 1) this.player1Pos = newPos; else this.player2Pos = newPos;
             } },
            { n: 'Energy Siphon', d: 'Steals 15 Energy from the opponent', f: () => { GameState.modifyEnergy(pNum === 1 ? 2 : 1, -15); GameState.modifyEnergy(pNum, 15); } },
            { n: 'Regen Matrix', d: 'Heals you for 40 HP', f: () => { GameState.modifyHP(pNum, 40); } },
            { n: 'Stasis Trap', d: 'Causes the opponent to skip 1 turn', f: () => { let o = pNum === 1 ? GameState.player2 : GameState.player1; o.turnSkips++; } },
            { n: 'Phase Shift', d: 'Swaps positions with the opponent', f: () => { let tmp = this.player1Pos; this.player1Pos = this.player2Pos; this.player2Pos = tmp; } }
        ];
        let rand = abilities[Math.floor(Math.random() * abilities.length)];
        GameState.showNotification(`Mystery! ${rand.n}: ${rand.d}`, 'success');
        rand.f();
    },

    async checkLaddersAndSnakes(pos, pNum) {
        return new Promise(resolve => {
            setTimeout(() => {
                let newPos = pos;
                let moved = false;
                let state = pNum === 1 ? GameState.player1 : GameState.player2;
                
                let midx = this.mysteryCells.indexOf(pos);
                if (midx > -1) {
                    this.mysteryCells.splice(midx, 1);
                    this.triggerMystery(pNum);
                }

                let l = this.ladders.find(x => x[0] === pos);
                if (l) {
                    if (state.activeEffects.find(e => e.name === 'Shock')) {
                        GameState.showNotification(`P${pNum} Shocked! Ladder frozen.`, 'success');
                    } else { newPos = l[1]; moved = true; }
                }
                
                let s = this.snakes.find(x => x[0] === pos);
                if (s) {
                    let ignoredRef = pNum === 1 ? this.p1Ignored : this.p2Ignored;
                    if (state.character.id === 'void_walker' && !ignoredRef) {
                        if (pNum === 1) this.p1Ignored = true; else this.p2Ignored = true;
                        GameState.showNotification('Void Walker: Snake ignored!', 'success');
                    } else {
                        newPos = s[1]; moved = true;
                        let penalty = state.upgrades.includes('Insulated Wiring') ? 0.05 : 0.10;
                        GameState.modifyEnergy(pNum, -Math.floor(state.energy * penalty));
                        if(state.character.id === 'viper_ghost') GameState.modifyEnergy(pNum, 10);
                        GameState.showNotification(`P${pNum} Snake hit! Lost ${penalty*100}% Energy`, 'danger');
                    }
                }

                if (moved) { if (pNum === 1) this.player1Pos = newPos; else this.player2Pos = newPos; }
                
                if (this.player1Pos === 100) {
                    let dmg = Math.round(150 * GameState.player1.character.dmgMult);
                    GameState.modifyHP(2, -dmg);
                    ScreenManager.showRoundConclusion(1, dmg);
                } else if (this.player2Pos === 100) {
                    let dmg = Math.round(150 * GameState.player2.character.dmgMult);
                    GameState.modifyHP(1, -dmg);
                    ScreenManager.showRoundConclusion(2, dmg);
                }
                resolve();
            }, 500);
        });
    },
    
    resetPositions() { this.player1Pos = 1; this.player2Pos = 1; this.p1Ignored = false; this.p2Ignored = false; }
};

const ScreenManager = {
    container: document.getElementById('screen-container'),
    p1Selection: null,
    mode: '1p', 

    init() { 
        Settings.init(); 
        HUD.init(); 
        
        document.getElementById('btn-replay-round').addEventListener('click', () => {
            document.getElementById('round-conclusion-overlay').classList.add('hidden');
            if (GameState.currentGame === 'Snakes') SnakesGame.init();
            else if (GameState.currentGame === 'TTT') QuantumTTT.init();
        });
        
        document.getElementById('btn-switch-game').addEventListener('click', () => {
            document.getElementById('round-conclusion-overlay').classList.add('hidden');
            if (GameState.currentGame === 'Snakes') this.showTTTGame();
            else if (GameState.currentGame === 'TTT') this.showSnakesGame();
        });
        
        document.getElementById('buy-med').addEventListener('click', () => GameState.buyItem(1, 'nanoMed', 'Nano-Med', 20, 'nanoMed'));
        document.getElementById('buy-super-med').addEventListener('click', () => GameState.buyItem(1, 'superMed', 'Nano-Repair Kit', 60, 'superMed'));
        document.getElementById('buy-warp').addEventListener('click', () => GameState.buyItem(1, 'warp', 'Time Warp / TTT Double', 55, 'warp'));
        document.getElementById('buy-rocket').addEventListener('click', () => GameState.buyItem(1, 'rocket', 'Rocket Boost / TTT Firewall', 30, 'rocket'));
        document.getElementById('buy-plate').addEventListener('click', () => GameState.buyItem(1, 'plate', 'Titanium Plate', 50, 'plate'));
        document.getElementById('buy-emp').addEventListener('click', () => GameState.buyItem(1, 'emp', 'EMP Override', 40, 'emp'));
        document.getElementById('buy-stim').addEventListener('click', () => GameState.buyItem(1, 'stim', 'Cyber-Stim / TTT Glitch', 50, 'stim'));

        document.getElementById('buy-upg-cargo').addEventListener('click', () => GameState.buyItem(1, 'cargo', 'Cargo Extension', 120, 'cargo', true));
        document.getElementById('buy-upg-insulated').addEventListener('click', () => GameState.buyItem(1, 'insulated', 'Insulated Wiring', 100, 'insulated', true));
        document.getElementById('buy-upg-tactical').addEventListener('click', () => GameState.buyItem(1, 'tactical', 'AI Tactical Uplink', 150, 'tactical', true));
        document.getElementById('buy-upg-wind').addEventListener('click', () => GameState.buyItem(1, 'wind', 'Second Wind', 80, 'wind', true));
        document.getElementById('buy-upg-core').addEventListener('click', () => GameState.buyItem(1, 'core', 'Efficiency Core', 75, 'core', true));
        document.getElementById('buy-upg-mom').addEventListener('click', () => GameState.buyItem(1, 'mom', 'Momentum', 90, 'mom', true));
    },
    clear() { this.container.innerHTML = ''; },

    showMainMenu() {
        this.clear();
        document.getElementById('top-hud').classList.add('hidden');
        document.getElementById('bottom-dashboard').classList.add('hidden');
        document.getElementById('round-conclusion-overlay').classList.add('hidden');
        const d = document.createElement('div');
        d.className = 'screen main-menu';
        d.innerHTML = `
            <h1 class="main-title">CYBERPUNK<br>MINIGAME HUB</h1>
            <button class="cyber-btn" id="start-btn">INITIALIZE</button>
        `;
        this.container.appendChild(d);
        document.getElementById('start-btn').addEventListener('click', () => this.showModeSelect());
    },

    showModeSelect() {
        this.clear();
        const d = document.createElement('div');
        d.className = 'screen mode-select';
        d.innerHTML = `
            <h2 class="main-title" style="font-size:40px; margin-bottom: 30px;">SELECT GAMEMODE</h2>
            <div style="display:flex; gap:30px;">
                <button class="cyber-btn" id="mode-1p">1 PLAYER (VS BOT)</button>
                <button class="cyber-btn" id="mode-2p">2 PLAYER (LOCAL)</button>
            </div>
        `;
        this.container.appendChild(d);
        document.getElementById('mode-1p').addEventListener('click', () => { this.mode = '1p'; this.showCharacterSelect(1); });
        document.getElementById('mode-2p').addEventListener('click', () => { this.mode = '2p'; this.showCharacterSelect(1); });
    },

    showCharacterSelect(playerNum) {
        this.clear();
        const d = document.createElement('div');
        d.className = 'screen character-select';
        
        let header = this.mode === '1p' ? 'SELECT CLASS' : `PLAYER ${playerNum}: SELECT CLASS`;
        let html = `<h2 class="main-title" style="font-size:40px; margin-bottom: 30px;">${header}</h2><div class="character-grid">`;
        Characters.forEach((char, i) => {
            html += `
                <div class="char-card" data-idx="${i}">
                    <h3>${char.name}</h3>
                    <div class="char-stats"><div>HP: <span>${char.hp}</span></div><div>DMG: <span>${char.dmgMult}x</span></div></div>
                    <div class="char-abilities">
                        <div class="ability-desc"><span>P:</span> ${char.passive.desc}</div>
                        <div class="ability-desc"><span>A (${char.active.cooldownTime}):</span> ${char.active.desc}</div>
                        <div class="ability-desc"><span>U (${char.ultimate.cooldownTime}):</span> ${char.ultimate.desc}</div>
                    </div>
                </div>`;
        });
        html += `</div>`;
        d.innerHTML = html;
        this.container.appendChild(d);

        document.querySelectorAll('.char-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const char = Characters[e.currentTarget.getAttribute('data-idx')];
                if (this.mode === '1p') {
                    let botChar = Characters[Math.floor(Math.random() * Characters.length)];
                    GameState.init(char, botChar, '1p');
                    this.showGameSelect();
                } else {
                    if (playerNum === 1) {
                        this.p1Selection = char;
                        this.showCharacterSelect(2);
                    } else {
                        GameState.init(this.p1Selection, char, '2p');
                        this.showGameSelect();
                    }
                }
            });
        });
    },

    showGameSelect() {
        this.clear();
        document.getElementById('top-hud').classList.remove('hidden');
        document.getElementById('bottom-dashboard').classList.add('hidden');
        const d = document.createElement('div');
        d.className = 'screen game-select';
        d.innerHTML = `
            <div class="game-cards">
                <div class="game-card" id="card-snakes"><h2>SNAKES<br>& LADDERS</h2><button class="cyber-btn purple">PLAY</button></div>
                <div class="game-card" id="card-ttt"><h2>QUANTUM<br>TIC-TAC-TOE</h2><button class="cyber-btn purple">PLAY</button></div>
            </div>
        `;
        this.container.appendChild(d);
        document.getElementById('card-snakes').addEventListener('click', () => this.showSnakesGame());
        document.getElementById('card-ttt').addEventListener('click', () => { this.clear(); this.showTTTGame(); });
    },

    setupMatchUI() {
        document.getElementById('bottom-dashboard').classList.remove('hidden');
        document.getElementById('btn-shop').classList.remove('hidden');
    },

    showSnakesGame() {
        this.clear();
        this.setupMatchUI();

        const d = document.createElement('div');
        d.className = 'screen in-game';
        d.innerHTML = `
            <div class="game-area" style="display:flex; flex-direction:column; align-items:center;">
                <div class="hud-center-vs" id="turn-indicator" style="margin-bottom:10px;"></div>
                <div id="sal-predict-label" style="font-family: var(--font-neon); font-size: 14px; color: var(--neon-cyan); margin-bottom: 5px; min-height: 20px; text-transform: uppercase;"></div>
                <canvas id="game-canvas" width="1000" height="600" style="border: 2px solid var(--neon-red); background: rgba(5,5,10,0.1);"></canvas>
                <div style="margin-top:20px; display:flex; justify-content:center; align-items:center;">
                    <button class="cyber-btn" id="roll-dice-btn" style="border-color:var(--neon-green); font-size:32px; padding:15px 50px;">ROLL DICE <span id="dice-result" style="color:var(--charcoal); margin-left:15px;"></span></button>
                </div>
            </div>
        `;
        this.container.appendChild(d);
        SnakesGame.init();
    },

    showTTTGame() {
        this.clear();
        this.setupMatchUI();
        QuantumTTT.init();
    },

    showRoundConclusion(winner, dmg) {
        const overlay = document.getElementById('round-conclusion-overlay');
        const text = document.getElementById('round-result-text');
        const btnSwitch = document.getElementById('btn-switch-game');
        const btnReplay = document.getElementById('btn-replay-round');
        
        overlay.classList.remove('hidden');
        
        const winnerName = winner === 1 ? "PLAYER 1" : (GameState.mode === '1p' ? "ENEMY" : "PLAYER 2");
        const gameName = GameState.currentGame === 'Snakes' ? "Snakes & Ladders" : "Quantum Tic-Tac-Toe";
        const otherGameName = GameState.currentGame === 'Snakes' ? "QUANTUM TTT" : "SNAKES & LADDERS";
        
        text.innerHTML = `<strong>${winnerName}</strong> wins the round of ${gameName}!<br>Dealt <strong>${dmg} DMG</strong>!`;
        btnSwitch.innerText = `SWITCH TO ${otherGameName}`;
        btnReplay.innerText = `REPLAY ${gameName.toUpperCase()}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ScreenManager.init();
    ScreenManager.showMainMenu();
});
