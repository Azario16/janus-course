<?php

namespace App\Repository;

use App\Entity\JanusRoom;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<JanusRoom>
 *
 * @method JanusRoom|null find($id, $lockMode = null, $lockVersion = null)
 * @method JanusRoom|null findOneBy(array $criteria, array $orderBy = null)
 * @method JanusRoom[]    findAll()
 * @method JanusRoom[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class JanusRoomRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, JanusRoom::class);
    }

    public function add(JanusRoom $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if($flush){
            $this->getEntityManager()->flush();
        }
    }

    //    /**
    //     * @return JanusRoom[] Returns an array of JanusRoom objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('t.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Test
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
