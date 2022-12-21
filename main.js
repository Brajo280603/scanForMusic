
        // import QrScanner from "./node_modules/qr-scanner/qr-scanner.min.js"
        let scanned ;

        let cameraLists = [];
        cameraLists.push("environment");
        cameraLists.push("user");   
        const cameraBtn = document.getElementById('cameraBtn');
        const cameraBtnImg = document.getElementById('cameraBtnImg');
        const cameraSwitcherBtn = document.getElementById('cameraSwitcherBtn');
        const video = document.getElementById('qr-video');
        const videoContainer = document.getElementById('video-container');
        videoContainer.className = "example-style-2";
        const camHasCamera = document.getElementById('cam-has-camera');
        const camList = document.getElementById('cam-list');

        // const camHasFlash = document.getElementById('cam-has-flash');
        const flashDiv = document.querySelector(".cameraFlash")
        const flashToggle = document.getElementById('flash-toggle');
        const flashState = document.getElementById('flash-state');
        const camQrResult = document.getElementById('cam-qr-result');
        const camQrResultTimestamp = document.getElementById('cam-qr-result-timestamp');
        const fileSelector = document.getElementById('file-selector');
        const fileQrResult = document.getElementById('file-qr-result');
    
        function setResult(label, result) {
            console.log(result.data);
            scanned = result.data;
            console.log("scanned:" + scanned);
            scanner.stop(); 
            label.textContent = result.data;
            camQrResultTimestamp.textContent = new Date().toString();
            label.style.color = 'teal';
            clearTimeout(label.highlightTimeout);
            label.highlightTimeout = setTimeout(() => label.style.color = 'inherit', 100);
        }
    
        // ####### Web Cam Scanning #######
    
        const scanner = new QrScanner(video, result => setResult(camQrResult, result), {
            onDecodeError: error => {
                camQrResult.textContent = error;
                camQrResult.style.color = 'inherit';
            },
            highlightScanRegion: true,
            highlightCodeOutline: true,
        });
    
        const updateFlashAvailability = () => {
            scanner.hasFlash().then(hasFlash => {
                // camHasFlash.textContent = hasFlash;
                flashToggle.style.display = hasFlash ? 'inline-block' : 'none';
                flashDiv.style.display = hasFlash ? 'block' : 'none';
            });
        };
    
        scanner.start().then(() => {
            updateFlashAvailability();
            // List cameras after the scanner started to avoid listCamera's stream and the scanner's stream being requested
            // at the same time which can result in listCamera's unconstrained stream also being offered to the scanner.
            // Note that we can also start the scanner after listCameras, we just have it this way around in the demo to
            // start the scanner earlier.
            QrScanner.listCameras(true).then(cameras => cameras.forEach(camera => {
                const option = document.createElement('option');
                option.value = camera.id;
                option.text = camera.label;

                // cameraLists.push(camera.id)
                cameraLists.push(option);
                // camList.add(option);

            }));
        });
    
        QrScanner.hasCamera().then(hasCamera => {
            // camHasCamera.textContent = hasCamera;
            if(!hasCamera){
                camHasCamera.style.display= "block";
            }
        });
    
        // for debugging
        window.scanner = scanner;
    
        // document.getElementById('scan-region-highlight-style-select').addEventListener('change', (e) => {
        //     console.log(e.target.value);
        //     videoContainer.className = e.target.value;
        //     scanner._updateOverlay(); // reposition the highlight because style 2 sets position: relative
        // });
    
        // document.getElementById('show-scan-region').addEventListener('change', (e) => {
        //     const input = e.target;
        //     const label = input.parentNode;
        //     label.parentNode.insertBefore(scanner.$canvas, label.nextSibling);
        //     scanner.$canvas.style.display = input.checked ? 'block' : 'none';
        // });
    
        // document.getElementById('inversion-mode-select').addEventListener('change', event => {
        //     scanner.setInversionMode(event.target.value);
        // });
            scanner.setInversionMode("both");
        // camList.addEventListener('change', event => {
        //     scanner.setCamera(event.target.value).then(updateFlashAvailability);
        // });


        cameraSwitcherBtn.addEventListener('click',()=>{
            if(cameraSwitcherBtn.value == "user"){
                scanner.setCamera(cameraSwitcherBtn.value).then(updateFlashAvailability);
                cameraSwitcherBtn.value="environment";
                console.log("cam changed:",cameraSwitcherBtn.value);
            }
            else if(cameraSwitcherBtn.value == "environment"){
                scanner.setCamera(cameraSwitcherBtn.value).then(updateFlashAvailability);
                cameraSwitcherBtn.value="user";
                console.log("cam changed:",cameraSwitcherBtn.value);
            }
        })

    
        flashToggle.addEventListener('click', () => {
            scanner.toggleFlash().then(() => flashState.textContent = scanner.isFlashOn() ? 'on' : 'off');
        });
    
        // document.getElementById('start-button').addEventListener('click', () => {
        //     scanner.start();
        // });
    
        // document.getElementById('stop-button').addEventListener('click', () => {
        //     scanner.stop();
        // });

        cameraBtn.addEventListener("click",()=>{
            if(cameraBtn.value=="on"){
                scanner.stop();
                cameraBtn.value = "off";
                console.log("cam off");
                cameraBtnImg.src="./style/icons/retake_material_square.png";
            }
            else if(cameraBtn.value == "off"){
                scanner.start();
                cameraBtn.value = "on";
                console.log("cam on");
                cameraBtnImg.src="./style/icons/close_material_square.png";
            }
        })
    
        // ####### File Scanning #######
    
        fileSelector.addEventListener('change', event => {
            const file = fileSelector.files[0];
            if (!file) {
                return;
            }
            QrScanner.scanImage(file, { returnDetailedScanResult: true })
                .then(result => setResult(fileQrResult, result))
                .catch(e => {
                    setResult(fileQrResult, { data: e || 'No QR code found.' });
                    
               });
        });
        // console.log(scanned);





        let iconBtns = document.querySelectorAll('.iconButton')
        iconBtns.forEach(e=>{
            e.children[0].setAttribute('draggable', false)
            // console.log(e.children[0])
        });