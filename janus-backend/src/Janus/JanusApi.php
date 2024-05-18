<?php

namespace App\Janus;

use Exception;
use GuzzleHttp\Client;

class JanusApi
{
    const TRANSACTION_STRING_LENGTH = 16;
    const JANUS_URL = 'http://janus-mediaserver:8005/janus';

    private Client $httpClient;
    public function __construct(
        Client $httpClient
    ) {
        $this->httpClient = $httpClient;
    }

    public function createSession(): int
    {
        try {
            $body = [
                'janus' => 'create',
                'transaction' => $this->getTransaction(),
            ];

            $res = $this->httpClient->post(
                self::JANUS_URL,
                [
                    'headers' => [
                        'Content-Type' => 'application/json; charset=utf-8',
                    ],
                    'body' => json_encode($body)
                ]
            );

        } catch (Exception $exception) {
            var_dump($exception);
        }

        $content = $res->getBody()->getContents();

        return json_decode($content)->data->id;
    }

    public function createPluginHandle(int $sessionId): int
    {
        try {
            $body = [
                'janus' => 'attach',
                'plugin' => 'janus.plugin.videoroom',
                'session_id' => $sessionId,
                'transaction' => $this->getTransaction(),
            ];

            $res = $this->httpClient->post(
                self::JANUS_URL,
                [
                    'body' => json_encode($body)
                ]
            );
        } catch (Exception $exception) {

        }
        $content = $res->getBody()->getContents();

        return json_decode($content)->data->id;
    }
    public function createRoom(int $roomId, int $sessionId, int $handleId): int
    {
        try {
            $body = [
                'body' => [
                    'request' => 'create',
                    'videocodec' => 'h264',
                    'room' => $roomId,
                    'notify_joining' => true,
                    'record' => false,
                    'publishers' => 8,
                    'rec_dir' => '/opt/record/10010000312',
                    'videoorient_ext' => false,
                    'h264_profile' => '42e01f',
                    'audiolevel_ext' => true
                ],
                'janus' => 'message',
                'handle_id' => $handleId,
                'session_id' => $sessionId,
                'transaction' => $this->getTransaction(),
            ];

            $res = $this->httpClient->post(
                self::JANUS_URL,
                [
                    'body' => json_encode($body)
                ]
            );
        } catch (Exception $exception) {

        }

        $content = $res->getBody()->getContents();

        return json_decode($content)->plugindata->data->room;
    }

    private function getTransaction(): string
    {
        return substr(str_shuffle(md5(time())), 0, self::TRANSACTION_STRING_LENGTH);
    }
}