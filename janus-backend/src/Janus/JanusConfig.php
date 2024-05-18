<?php

namespace App\Janus;

use App\Entity\JanusRoom;
use App\Repository\JanusRoomRepository;
use DateTime;
use Exception;
use GuzzleHttp\Client;

class JanusConfig
{
    private JanusRoomRepository $janusRoomRepository;
    private JanusApi $janusApi;
    public function __construct(
        JanusApi $janusApi,
        JanusRoomRepository $janusRoomRepository
    ) {
        $this->janusApi = $janusApi;
        $this->janusRoomRepository = $janusRoomRepository;
    }

    public function getOrCreateJanusRoom(int $roomId): void
    {
        try {

            $sessionId = $this->janusApi->createSession();
            
            $handleId = $this->janusApi->createPluginHandle($sessionId);

            $room = $this->janusApi->createRoom($roomId, $sessionId, $handleId);

            $janusRoom = new JanusRoom();
            $janusRoom->setId($room);
            $janusRoom->setServerUri('ws://localhost:8005/janus');
            $janusRoom->setCreatedAt(new DateTime());
            $janusRoom->setUpdatedAt(new DateTime());

            $this->janusRoomRepository->add($janusRoom, true);

        } catch (Exception $exception) {
            var_dump($exception);
        }
    }
}