<?php

namespace App\Controller;

use App\Janus\JanusConfig;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class JanusConfigController extends AbstractController
{

    private JanusConfig $janusConfig;
    public function __construct(JanusConfig $janusConfig){
        $this->janusConfig = $janusConfig;
    }

    #[Route('/janus/config', name: 'app_janus_config', methods: 'post')]
    public function janusConfigController(Request $request): JsonResponse
    {
        $content = $request->getContent();

        $roomId = json_decode($content)->roomId;

        $this->janusConfig->getOrCreateJanusRoom($roomId);

        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/JanusConfigController.php',
        ]);
    }
}
