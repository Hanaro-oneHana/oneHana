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
  `current_balance` bigint NOT NULL DEFAULT '0',
  `loan` bigint NOT NULL DEFAULT '0',
  `user_id` int unsigned NOT NULL,
  `type` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_account_user` (`user_id`),
  CONSTRAINT `fk_account_user` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Account`
--

LOCK TABLES `Account` WRITE;
/*!40000 ALTER TABLE `Account` DISABLE KEYS */;
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
  `rate` decimal(5,2) NOT NULL
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
  `rate` decimal(5,2) NOT NULL
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
-- Table structure for table `Mate`
--

DROP TABLE IF EXISTS `Mate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Mate` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_mate_user` (`user_id`),
  CONSTRAINT `fk_mate_user` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Mate`
--

LOCK TABLES `Mate` WRITE;
/*!40000 ALTER TABLE `Mate` DISABLE KEYS */;
/*!40000 ALTER TABLE `Mate` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Partner`
--

LOCK TABLES `Partner` WRITE;
/*!40000 ALTER TABLE `Partner` DISABLE KEYS */;
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
  `reservation_date` varchar(30) NOT NULL,
  `partner_service_id` int unsigned NOT NULL,
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
  `type` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
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
  `user_date` varchar(20) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `partner_service_id` int unsigned NOT NULL,
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

-- Dump completed on 2025-06-10 14:29:20
