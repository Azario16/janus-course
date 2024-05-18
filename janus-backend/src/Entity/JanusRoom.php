<?php

namespace App\Entity;

use App\Repository\JanusRoomRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Ignore;
use Doctrine\DBAL\Types\Types;

#[ORM\Entity(repositoryClass:JanusRoomRepository::class)]

class JanusRoom
{
    use DatedEntityTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    #[Ignore]
    private $id;

    
    #[ORM\Column(type: Types::STRING, length: 255)]
    
    private $serverUri;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getServerUri(): ?string
    {
        return $this->serverUri;
    }

    public function setServerUri(string $serverUri): self
    {
        $this->serverUri = $serverUri;

        return $this;
    }
}
