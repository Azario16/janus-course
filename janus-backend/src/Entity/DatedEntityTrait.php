<?php

namespace App\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\DBAL\Types\Types;

trait DatedEntityTrait
{
    #[ORM\Column(name: "created_at", type: Types::DATE_MUTABLE)]
    private DateTime $createdAt;

    #[ORM\Column(name: "updated_at", type: Types::DATE_MUTABLE)]
    private DateTime $updatedAt;

    public function setCreatedAt(DateTime $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): DateTime
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(DateTime $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }

    #[ORM\PrePersist()]
    public function initCreatedAt(): void
    {
        $this->createdAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    #[ORM\PreUpdate()]
    public function updateUpdatedAt(): void
    {
        $this->updatedAt = new DateTime();
    }
}
