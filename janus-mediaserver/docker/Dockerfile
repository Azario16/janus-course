FROM debian:11

RUN apt-get update

# RUN echo deb http://deb.debian.org/debian bullseye main >> /etc/apt/sources.list && \
# 	apt-get update && \
# 	apt-cache policy libmicrohttpd-dev libssl-dev libopus-dev

RUN apt-get install -y \
	git \
	build-essential \
	autoconf \
	automake \
	autotools-dev \
	dh-make \
	debhelper \
	devscripts \
	fakeroot \
	gtk-doc-tools \
	xutils \
	lintian \
    libssl-dev \
    pbuilder \
    libsofia-sip-ua-dev \
    libogg-dev \
    pkg-config \
    gengetopt \
    libtool \
    cmake \
    libavutil-dev \
    libavcodec-dev \
    libavformat-dev \
    liblua5.3-dev  \
    libmicrohttpd-dev \
    libjansson-dev \
    libcurl4-openssl-dev \
    libglib2.0-dev \
    libsrtp2-dev \
    libconfig-dev \
    libopus-dev  \
    python3 \
    python3-pip \
    python3-setuptools \
    python3-wheel \
    ninja-build && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip3 install meson

RUN git clone https://gitlab.freedesktop.org/libnice/libnice \
 && cd libnice \
 && git checkout 0.1.18 \
 && meson --prefix=/usr build \
 && ninja -C build \
 && ninja -C build install

RUN mkdir -p /usr/src/janus /var/janus/janus/log /var/janus/janus/data

RUN git clone https://github.com/warmcat/libwebsockets.git

RUN cd libwebsockets && \
    git checkout v3.2-stable && \
    mkdir build && \
    cd build && \
    cmake -DLWS_MAX_SMP=1 -DLWS_WITHOUT_EXTENSIONS=0 -DCMAKE_INSTALL_PREFIX:PATH=/usr -DCMAKE_C_FLAGS="-fpic" .. && \
    make && make install

RUN git clone https://github.com/sctplab/usrsctp

RUN cd usrsctp && \
    git checkout tags/0.9.5.0 -b 0.9.5.0 && \
    ./bootstrap && \
    ./configure --prefix=/usr --disable-programs --disable-inet --disable-inet6 && \
    make && sudo make install

RUN cd /usr/src/janus && \
    wget -c https://github.com/meetecho/janus-gateway/archive/v1.0.1.tar.gz

COPY ./*.patch.diff /usr/src/janus/

RUN cd /usr/src/janus && \
    tar -xzf v1.0.1.tar.gz && \
    cd janus-gateway-1.0.1 && \
    sh autogen.sh && \
	./configure --prefix=/var/janus/janus --enable-post-processing --disable-rabbitmq

RUN	cd /usr/src/janus/janus-gateway-1.0.1 && make && \
    make install && make configs && \
	rm -rf /usr/src/janus

RUN cd /usr/src && \
    wget -c https://github.com/openssl/openssl/archive/refs/tags/OpenSSL_1_1_1k.tar.gz && \
    tar -xzf OpenSSL_1_1_1k.tar.gz && \
    cd openssl-OpenSSL_1_1_1k && \
    ./config enable-weak-ssl-ciphers no-tests  no-shared && \
    make && \
    make install && \
    rm -rf /usr/src/openssl-OpenSSL_1_1_1k

RUN sudo apt-get update
RUN sudo apt-get install -y ffmpeg

EXPOSE 5002-5006/tcp 5002/tcp 5003/tcp 5004/tcp 5005/tcp 5006/tcp
EXPOSE 5002-5006/udp 5002/udp 5003/udp 5004/udp 5005/udp 5006/udp
EXPOSE 8088/tcp 8188/tcp
EXPOSE 8188/udp 20000-40000/udp

CMD ["/var/janus/janus/bin/janus"]
