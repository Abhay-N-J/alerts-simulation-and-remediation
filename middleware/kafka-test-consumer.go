package main

import (
	"asmr/alerts"
	"asmr/kafka"
	"log"
	"os"
	"github.com/IBM/sarama"
)

func main() {
	logger := log.New(os.Stdout, "kafka-consumer: ", log.LstdFlags)

	brokers := []string{"localhost:9092"}
	config := sarama.NewConfig()
	config.Consumer.Offsets.Initial = sarama.OffsetNewest

	consumer, err := kafka.NewConsumer(brokers, config, logger)
	if err != nil {
		logger.Fatalf("Error creating consumer: %s\n", err)
	}

	defer consumer.Close()

	alertsChan := make(chan alerts.Alerts)
	doneChan := make(chan struct{})

	logger.Println("Consuming alerts !")

	go consumer.ConsumeAlerts("alerts", alertsChan, doneChan)
consumerLoop:

	for {
		select {
		case alert := <-alertsChan:
			logger.Printf("Received alert: alrtID: %s, NodeID: %s, Description: %s, Severity: %s, Source: %s, CreatedAt: %s\n", alert.ID.String(), alert.NodeID.String(), alert.Description, alert.Severity, alert.Source, alert.CreatedAt)

		case <-doneChan:
			break consumerLoop
		}
	}
}