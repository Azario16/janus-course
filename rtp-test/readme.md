## Тестирование RTP потока с помощью ffmpeg 

ffmpeg -re -i test.mp4 -c:v copy -f rtp rtp://localhost:8011

ffmpeg -f lavfi -i test.mp4 -c:a opus -b:a 20k -strict -2 -f rtp rtp://localhost:5004

http://localhost:8011/

ffmpeg -re -i rtp-test.mp4 -c:v copy -f rtp rtp://localhost:8004

ffmpeg -i rtp-test.mp4  -f rtp rtp://localhost:8004



ffmpeg -i rtp://127.0.0.1:5024 -c:v libx264 -vf "scale=640:360" output2.mp4
ffmpeg -i rtp://127.0.0.1:5004 -c:v libx264 -vf "scale=640:360" output2.mp4


ffmpeg -f lavfi -i testsrc=duration=10:size=640x480:rate=30 -f lavfi -i sine=frequency=1000:duration=10 -c:v libx264 -crf 18 -preset slow -c:a aac -b:a 192k output.mp4


ffmpeg -f lavfi -i testsrc=duration=10:size=640x480:rate=30 -f lavfi -i sine=frequency=1000:duration=10 -c:v libx264 -crf 18 -preset slow -c:a aac -f rtp rtp://localhost:5004




## Рабочая команда для генерации аудиоо 


ffmpeg -f lavfi -i "sine=frequency=1000:duration=500" -c:a opus -b:a 20k -strict -2 -f rtp rtp://127.0.0.1:5002 

ffmpeg -re -stream_loop -1 -i rtp-test.mp4 -c:a opus -b:a 20k -strict -2 -f rtp rtp://127.0.0.1:6002 

ffmpeg -f lavfi -i "sine=frequency=1000:duration=500" -c:a opus -b:a 20k -strict -2 -f rtp -sdp_file output.sdp rtp://127.0.0.1:5002



ffmpeg -f lavfi -i "testsrc=size=320x240:rate=15" -c:v libvpx -b:v 256k -speed 2 -g 30 -error-resilient 1 -f rtp rtp://127.0.0.1:6004


ffmpeg -f lavfi -i "testsrc=size=320x240:rate=15" -c:v libvpx -b:v 256k -speed 2 -g 30 -error-resilient 1 -f rtp -sdp_file output-vid.sdp rtp://127.0.0.1:5004


ffmpeg -f lavfi -i "testsrc=size=320x240:rate=15" -video_size 640x480 -framerate 25 -an -c:v libvpx -quality realtime -f rtp rtp://localhost:5000

ffmpeg -f lavfi -i "testsrc=size=320x240:rate=30" -f rtp -sdp_file output-vid.sdp rtp://127.0.0.1:5004




ffmpeg -protocol_whitelist file,udp,rtp -i "rtp://127.0.0.1:5000" -c:v copy output2.mp4

ffmpeg -protocol_whitelist file,udp,rtp -i "rtp://127.0.0.1:5000" -c:v copy output2.mp4


# Рабочие команлы для видео 

cd /opt/rtp-test/


ffmpeg 
-re -stream_loop 1
-i rtp-test.mp4 
-vcodec libx264
-profile:v baseline 
-framerate 59 
-b:v 5M
-tune zerolatency 
-r 24 
-g 60 
-an 
-f rtp rtp://127.0.0.1:5004?pkt_size=1300

ffmpeg 
-f gdigrab 
-video_size 1024x768 
-offset_x 1920 
-i desktop
-vcodec libx264
-b:v 5M
-r 24 
-g 60 
-an 
-f rtp rtp://127.0.0.1:5004?pkt_size=1300


ffmpeg 
-f dshow 
-i video="USB2.0 HD UVC WebCam"
-vcodec libx264
-framerate 59 
-b:v 5M
-tune zerolatency 
-r 24 
-g 60 
-an 
-f rtp rtp://127.0.0.1:5004?pkt_size=1300&videortcpport=5005


ffmpeg 
-re -stream_loop 1
-i rtp-test.mp4 
-vcodec libx264
-profile:v baseline 
-framerate 59 
-b:v 5M
-tune zerolatency 
-r 24 
-g 60 
-an 
-f rtp rtp://localhost:5004?pkt_size=1300

ffmpeg 
-re -stream_loop 
-1 
-i ./rtp-test.mp4 
-s 426x240 
-c:v libx264 
-profile:v baseline 
-b:v 1M 
-r 24 
-g 60 
-an 
-f rtp rtp://127.0.0.1:5004?pkt_size=1300

ffmpeg -i "rtp-test.mp4" 
-s 426x240 
-c:v libx264 
-profile:v baseline 
-b:v 1M
-r 24 
-g 60 
-an 
-f rtp rtp://127.0.0.1:6004?pkt_size=1300


ffmpeg -re -stream_loop -1 -i ./rtp-test.mp4 -s 426x240 -c:v libx264 -profile:v baseline -b:v 1M -r 24 -g 60 -an -f rtp rtp://127.0.0.1:6002?pkt_size=1300


ffmpeg -re -f gdigrab -i desktop -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -f rtp rtp://127.0.0.1:5004?pkt_size=40

ffmpeg 
-re -stream_loop 1
-f gdigrab 
-i desktop
-vcodec libx264
-preset ultrafast 
-pix_fmt yuv420p

-framerate 59 
-b:v 5M
-r 24 
-g 60 
-an 
-f rtp rtp://127.0.0.1:5004?pkt_size=50

ffmpeg 
-f gdigrab 
-video_size 1024x768 -offset_x 1920 
-i desktop 
-vcodec h264 

-vf scale=680:420 -ssrc 100000
-f rtp rtp://127.0.0.1:5004?pkt_size=1000

ffmpeg 
-f gdigrab 
-video_size 1920x1080 
-offset_x 1920 
-i desktop 
-vcodec libx264 
-tune zerolatency 
-preset ultrafast 
-pix_fmt yuv420p 
-b 9000k 
-f rtp rtp://127.0.0.1:5004?pkt_size=3000


ffmpeg 
 -f dshow 
-i video="USB2.0 HD UVC WebCam"
-f rtp rtp://127.0.0.1:5004?pkt_size=3000



iperf3 -c 172.19.0.2 -u -b 1M -t 10 -p 5003

iperf3 -c 172.19.0.1 -u -b 1M -t 10 -p 5201

iperf3 -c 127.0.0.1 -u -b 1M -t 10 -p 5201

iperf3 -c host.docker.internal --udp  -b 5000M -p 5201

iperf -s -p 5003




## Рабочий вариант 03.05.2024 RTP

ffmpeg 
-re -stream_loop 
-1 
-i ./rtp-test.mp4 
-s 426x240 
-c:v libx264 
-profile:v baseline 
-b:v 1M 
-r 24 
-g 60 
-an 
-f rtp rtp://127.0.0.1:5004?pkt_size=1300

## Эксперимент
ffmpeg 
-f gdigrab 
-i desktop
-video_size 1024x768 -offset_x 1920 
-s 640x480
-c:v libx264 

-tune zerolatency 
-r 24 

-g 60 
-an 
-f rtp rtp://127.0.0.1:5004?pkt_size=100


ffmpeg 
-f gdigrab 
-framerate 59 
-video_size 1920x1080
-offset_x 1920 
-i desktop 
-vcodec libx264 
-tune zerolatency 
-pix_fmt yuv420p
-strict experimental
-vf scale=1500:1080

-f rtp rtp://127.0.0.1:5004?pkt_size=200

## Тест RTSP

ffmpeg 
-f gdigrab 
-framerate 59 
-video_size 1920x1080
-offset_x 1920 
-i desktop 
-vcodec libx264 
-tune zerolatency 
-pix_fmt yuv420p
-strict experimental
-vf scale=680:420

-f rtsp rtsp://127.0.0.1:8554/unicast


ffmpeg -re -i rtp-test.mp4 -c:v copy -f rtsp rtsp://127.0.0.1:8554/unicast

ffmpeg -re -i rtp-test.mp4 -c:v libx264 -f rtsp rtsp://127.0.0.1:8554/unicast


ffmpeg 
-i output.mp4 
-rtsp_transport tcp 
-c:v libx264 
-preset ultrafast 
-tune zerolatency 
-b:v 500k 
-c:a aac 
-strict experimental 
-f rtsp rtsp://127.0.0.1:8554/unicast