-- MySQL dump 10.13  Distrib 5.7.24, for osx11.1 (x86_64)
--
-- Host: localhost    Database: durihana
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Account`
--

DROP TABLE IF EXISTS `Account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Account` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `account` varchar(31) NOT NULL,
  `balance` bigint NOT NULL DEFAULT '0',
  `type` tinyint NOT NULL COMMENT '0:입출금계좌 1:예금계좌 2:적금계좌 3:대출계좌',
  `withdraw_cnt` tinyint NOT NULL DEFAULT '0',
  `expire_date` varchar(31) DEFAULT NULL,
  `user_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_account_user` (`user_id`),
  CONSTRAINT `fk_account_user` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Account`
--

LOCK TABLES `Account` WRITE;
/*!40000 ALTER TABLE `Account` DISABLE KEYS */;
INSERT INTO `Account` VALUES (1,'530-000000-00000',100000000,0,0,NULL,1),(2,'530-100000-00000',200000000,1,0,'2026-06-13 17:40:55',1),(3,'530-200000-00000',300000000,2,0,'2027-06-13 17:40:55',1),(4,'530-300000-00000',400000000,3,0,'2027-06-13 17:40:55',1),(5,'530-010000-00000',100000000,0,0,NULL,2),(6,'530-020000-00000',100000000,1,0,'2026-06-13 17:40:55',2),(7,'530-030000-00000',100000000,2,0,'2027-06-13 17:40:55',2),(8,'530-040000-00000',100000000,3,0,'2026-06-13 17:40:55',2);
/*!40000 ALTER TABLE `Account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BudgetPlan`
--

DROP TABLE IF EXISTS `BudgetPlan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BudgetPlan` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `partner_service_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_budget_user` (`user_id`),
  KEY `fk_budget_service` (`partner_service_id`),
  CONSTRAINT `fk_budget_service` FOREIGN KEY (`partner_service_id`) REFERENCES `PartnerService` (`id`),
  CONSTRAINT `fk_budget_user` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BudgetPlan`
--

LOCK TABLES `BudgetPlan` WRITE;
/*!40000 ALTER TABLE `BudgetPlan` DISABLE KEYS */;
/*!40000 ALTER TABLE `BudgetPlan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DepositInterest`
--

DROP TABLE IF EXISTS `DepositInterest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DepositInterest` (
  `id` int unsigned NOT NULL,
  `period` tinyint NOT NULL,
  `rate` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DepositInterest`
--

LOCK TABLES `DepositInterest` WRITE;
/*!40000 ALTER TABLE `DepositInterest` DISABLE KEYS */;
/*!40000 ALTER TABLE `DepositInterest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LoanInterest`
--

DROP TABLE IF EXISTS `LoanInterest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LoanInterest` (
  `id` int unsigned NOT NULL,
  `period` tinyint NOT NULL,
  `rate` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LoanInterest`
--

LOCK TABLES `LoanInterest` WRITE;
/*!40000 ALTER TABLE `LoanInterest` DISABLE KEYS */;
/*!40000 ALTER TABLE `LoanInterest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Partner`
--

DROP TABLE IF EXISTS `Partner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Partner` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `partner_category_id` int unsigned NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(30) DEFAULT NULL,
  `address` varchar(30) NOT NULL,
  `discount_rate` decimal(5,2) NOT NULL DEFAULT '0.00',
  `service_detail` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_partner_category` (`partner_category_id`),
  CONSTRAINT `fk_partner_category` FOREIGN KEY (`partner_category_id`) REFERENCES `PartnerCategory` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Partner`
--

LOCK TABLES `Partner` WRITE;
/*!40000 ALTER TABLE `Partner` DISABLE KEYS */;
INSERT INTO `Partner` VALUES (1,'스드메전문점1',1,'010-1111-1112','a@naver.com','주소1',0.10,'스드메 전문점1',1),(2,'스드메전문점2',1,'010-1111-1113','b@naver.com','주소2',0.20,'스드메 전문점2',1),(3,'예식장전문점1',2,'010-1111-1114','c@naver.com','주소3',0.04,'예식장 전문점1',1),(4,'예식장전문점2',2,'010-1111-1115','d@naver.com','주소4',0.02,'예식장 전문점2',1),(5,'여행사전문점1',3,'010-1111-1116','e@naver.com','주소5',0.04,'허니문 전문점1',1),(6,'여행사전문점2',3,'010-1111-1117','f@naver.com','주소6',0.30,'허니문 전문점1',1);
/*!40000 ALTER TABLE `Partner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PartnerCalendar`
--

DROP TABLE IF EXISTS `PartnerCalendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PartnerCalendar` (
  `id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `reservation_date` varchar(31) NOT NULL,
  `partner_service_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_partnercalender_user` (`user_id`),
  KEY `fk_partnercalender_service` (`partner_service_id`),
  CONSTRAINT `fk_partnercalender_service` FOREIGN KEY (`partner_service_id`) REFERENCES `PartnerService` (`id`),
  CONSTRAINT `fk_partnercalender_user` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PartnerCalendar`
--

LOCK TABLES `PartnerCalendar` WRITE;
/*!40000 ALTER TABLE `PartnerCalendar` DISABLE KEYS */;
INSERT INTO `PartnerCalendar` VALUES (1,1,'2025/08/10 18:00',1);
/*!40000 ALTER TABLE `PartnerCalendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PartnerCategory`
--

DROP TABLE IF EXISTS `PartnerCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PartnerCategory` (
  `id` int unsigned NOT NULL,
  `type` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PartnerCategory`
--

LOCK TABLES `PartnerCategory` WRITE;
/*!40000 ALTER TABLE `PartnerCategory` DISABLE KEYS */;
INSERT INTO `PartnerCategory` VALUES (1,'스드메'),(2,'예식장'),(3,'여행');
/*!40000 ALTER TABLE `PartnerCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PartnerService`
--

DROP TABLE IF EXISTS `PartnerService`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PartnerService` (
  `id` int unsigned NOT NULL,
  `partner_id` int unsigned NOT NULL,
  `name` varchar(20) NOT NULL,
  `content` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_service_partner` (`partner_id`),
  CONSTRAINT `fk_service_partner` FOREIGN KEY (`partner_id`) REFERENCES `Partner` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PartnerService`
--

LOCK TABLES `PartnerService` WRITE;
/*!40000 ALTER TABLE `PartnerService` DISABLE KEYS */;
INSERT INTO `PartnerService` VALUES (1,3,'럭셔리 예식장','{\"식대\": 10, \"위치\": \"서울\", \"스타일\": \"호텔\", \"식사형태\": \"뷔페\", \"예식형태\": \"동시예식\", \"최대수용인원\": 300, \"최소보증인원\": 100}'),(2,4,'스몰 예식장','{\"식대\": 7, \"위치\": \"서울\", \"스타일\": \"스몰\", \"식사형태\": \"코스\", \"예식형태\": \"분리예식\", \"최대수용인원\": 80, \"최소보증인원\": 30}'),(3,3,'한옥 예식장','{\"식대\": 9, \"위치\": \"전주\", \"스타일\": \"한옥\", \"식사형태\": \"한상차림\", \"예식형태\": \"동시예식\", \"최대수용인원\": 120, \"최소보증인원\": 50}'),(4,4,'야외 예식장','{\"식대\": 8, \"위치\": \"강원\", \"스타일\": \"야외\", \"식사형태\": \"뷔페\", \"예식형태\": \"분리예식\", \"최대수용인원\": 100, \"최소보증인원\": 40}'),(5,3,'프라이빗 예식장','{\"식대\": 11, \"위치\": \"부산\", \"스타일\": \"호텔\", \"식사형태\": \"코스\", \"예식형태\": \"동시예식\", \"최대수용인원\": 200, \"최소보증인원\": 80}'),(6,1,'스드메 실내+머메이드','{\"스튜디오\": \"실내\", \"드레스형식\": \"머메이드 라인\"}'),(7,1,'스드메 실내+프린세스','{\"스튜디오\": \"실내\", \"드레스형식\": \"프린세스 라인\"}'),(8,1,'스드메 야외+벨','{\"스튜디오\": \"야외\", \"드레스형식\": \"벨 라인\"}'),(9,2,'스드메 야외+프린세스','{\"스튜디오\": \"야외\", \"드레스형식\": \"프린세스 라인\"}'),(10,2,'스드메 실내+벨','{\"스튜디오\": \"실내\", \"드레스형식\": \"벨 라인\"}'),(11,5,'가성비여행','{\"기간\": \"2026/03/10 ~ 2026/03/20\", \"숙소\": \"3성 호텔\", \"여행지\": \"일본\", \"항공사\": \"피치항공\"}'),(12,5,'휴양여행','{\"기간\": \"2026/01/17 ~ 2026/01/21\", \"숙소\": \"료칸\", \"여행지\": \"일본\", \"항공사\": \"대한항공\"}'),(13,5,'엑티비티여행','{\"기간\": \"2028/09/10 ~ 2028/09/17\", \"숙소\": \"게르\", \"여행지\": \"몽골\", \"항공사\": \"대한항공\"}'),(14,6,'쇼핑여행','{\"기간\": \"2027/06/25 ~ 2027/07/03\", \"숙소\": \"비즈니스 호텔\", \"여행지\": \"일본\", \"항공사\": \"대한항공\"}'),(15,6,'휴양여행','{\"기간\": \"2027/10/31 ~ 2027/11/20\", \"숙소\": \"4성 호텔\", \"여행지\": \"아이슬란드\", \"항공사\": \"ANA\"}');
/*!40000 ALTER TABLE `PartnerService` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `birth` date NOT NULL,
  `email` varchar(31) NOT NULL,
  `code` varchar(15) DEFAULT NULL,
  `mate_code` varchar(15) DEFAULT NULL,
  `type` tinyint NOT NULL DEFAULT '0' COMMENT '0:회원 1:관리자 2:제휴',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'부부1남','1111','010-1111-1111','1995-05-12','abc1@naver.com','abc1','abc2',0),(2,'부부1여','2222','010-1112-1111','1997-12-24','abc2@naver.com','abc2','abc1',0),(3,'관리자','1234','010-1115-1111','1998-03-17','abc5@naver.com',NULL,NULL,1),(4,'제휴처','5678','010-1116-1111','1996-09-30','abc6@naver.com',NULL,NULL,2);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserCalendar`
--

DROP TABLE IF EXISTS `UserCalendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserCalendar` (
  `id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `user_date` varchar(31) NOT NULL,
  `partner_service_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_usercalender_user` (`user_id`),
  KEY `fk_usercalender_service` (`partner_service_id`),
  CONSTRAINT `fk_usercalender_service` FOREIGN KEY (`partner_service_id`) REFERENCES `PartnerService` (`id`),
  CONSTRAINT `fk_usercalender_user` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserCalendar`
--

LOCK TABLES `UserCalendar` WRITE;
/*!40000 ALTER TABLE `UserCalendar` DISABLE KEYS */;
INSERT INTO `UserCalendar` VALUES (1,1,'2025/08/10 18:00',1);
/*!40000 ALTER TABLE `UserCalendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'durihana'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-13 17:43:43