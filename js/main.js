let main, 
		numbers, 
		biggest, 
		playerBiggest, 
		p, 
		n = 50; /* number of tiles on the game */

const getRandomBigNumber = function(){
	let s = "";
	const r = Math.floor(Math.random() * 101);
	let i = 0;
	while(i < r){
		const n = Math.floor( Math.random() * 10 );
		if( n && i < r ){
			s = n+s;
			i++;
			if( i % 3 == 0 && i < r){	
				s = "."+s;
			}
		}
	}
	return s.length ? s : "0";
}

const hideModal = function(){
	let modal = document.body.lastChild;
	modal.remove();
}

const showModal = function(){
	const modal = document.createElement('div');
	modal.style.width = "100%";
	modal.style.height = "100%";
	modal.style.display = "flex";
	modal.style.alignItems = "center";
	modal.style.justifyContent = "center";
	modal.style.position = "absolute";
	modal.style.left = 0;
	modal.style.top = 0;
	modal.style.backgroundColor = "rgba(0,0,0,0.5)";
	let box = document.createElement('div');
	box.style.display = "flex";
	box.style.flexDirection = "column";
	box.style.alignItems = "center";
	box.style.justifyContent = "space-around";
	box.style.width = "80%";
	box.style.height = "80%";
	box.style.backgroundColor = "white";
	box.style.border = "solid 1px black";
	let result = document.createElement('div');
	result.style.wordBreak = "break-all";
	result.innerHTML = playerBiggest == biggest ? "Win" : "Lose";
	result.innerHTML += "<br>Plays: "+p+" out of "+n;
	result.innerHTML += "<br>You choose: "+playerBiggest;
	result.innerHTML += "<br>The biggest: "+biggest;
	let reset = document.createElement('button');
	reset.innerHTML = "reset";
	reset.addEventListener("click", function(){
		hideModal();
		init();
	});
	
	box.appendChild( result );
	
	box.appendChild( reset );
	
	modal.appendChild( box );
	
	document.body.appendChild( modal );
}

const isBigger = function(a, b){
	if( a === b )
		return false
	if( a.length > b.length ){
		return true;
	}else if( a.length < b.length ){
		return false;
	}else{
		const r = /\./g;
		a = a.replace(r, ''), b = b.replace(r, '');
		for(let i = 0, end = a.length; i < end; i++){
			const n1 = a[i], n2 = b[i];
			if( n1 > n2 ){
				return true;
			}else if( n1 < n2 ){
				return false;
			}
		}
	}
	
}

const init = function(){
	document.body.innerHTML = "";
	const check = {};
	numbers = {};
	p = 0;
	biggest = null;
	playerBiggest = null;
	main = document.createElement('div');
	main.id = "main";
	const status = document.createElement('div');
	status.id = "status";
	status.style.width = "100%";
	status.style.display = "flex";
	status.style.alignItems = "center";
	status.style.justifyContent = "space-around";
	const plays = document.createElement('div');
	plays.style.textAlign = "center";
	plays.innerHTML = "Plays<br>"+p;
	plays.width = "20%";
	const history = document.createElement('div');
	history.id = "history";
	history.innerHTML = "<br>";
	history.style.display = "block";
	history.style.textAlign = "right";
	history.style.height = "150px";
	history.style.width = "80%";
	history.style.overflowY = "scroll";
	const done = document.createElement('button');
	done.innerText = "I'm done";
	done.addEventListener('click', function(){
		if( !playerBiggest )
			return
		showModal();
	});
	const computer = document.createElement('button');
	computer.innerText = "Computer";
	computer.addEventListener('click', function(){
		computerPlay();
	});
	const bottom = document.createElement('div');
	bottom.style.width = "100%";
	bottom.style.display = "flex";
	bottom.style.flexDirection = "row";
	bottom.style.alignItems = "center";
	bottom.style.justifyContent = "space-around";
	let i = 0;
	while(i < n){
		const number = getRandomBigNumber();
		if( !check[number] ){
			if( !biggest || isBigger(number, biggest) )
				biggest = number;
			check[number] = true;
			numbers[i] = number;
			let btn = document.createElement('button');
			btn.dataset.id = i;
			btn.innerText = i;
			main.appendChild( btn );
			i++;
		}
	}
	status.appendChild( plays );
	status.appendChild( history );
	document.body.appendChild( status );
	document.body.appendChild( main );
	bottom.appendChild( computer );
	bottom.appendChild( done );
	document.body.appendChild( bottom );
	main.addEventListener('click', function(e){
		if( e.target.dataset.id ){
			plays.innerHTML = "Plays<br>"+(++p);
			playerBiggest = numbers[ e.target.dataset.id ];
			history.innerHTML = "<span>"+e.target.dataset.id+" - "+numbers[ e.target.dataset.id ]+"</span><br>"+history.innerHTML;
			e.target.disabled = true;
			if( p == n )
				showModal();
		}
	});
}

init();

const selectPlay = function(){
	if( p == n ){
		showModal();
		return null;
	}
	const btns = main.children;
	let ok = false, btn;
	while(!ok){
		btn = btns[ Math.floor( Math.random() * btns.length ) ];
		if( !btn.disabled )
			ok = true;
	}
	return btn;
}

const computerPlay = function(){
	init();
	let myBiggest, btn;
	let m = Math.ceil(n / Math.E);
	for(let i = 0; i < m; i++){
		btn = selectPlay();
		btn.click();
		if( !myBiggest || isBigger( numbers[ btn.dataset.id ], myBiggest) )
			myBiggest = numbers[ btn.dataset.id ];
	}
	while(1){
		btn = selectPlay();
		if( !btn )
			break;
		btn.click();
		if( isBigger( numbers[ btn.dataset.id ], myBiggest ) ){
			break;
		}
	}
	showModal();
}

