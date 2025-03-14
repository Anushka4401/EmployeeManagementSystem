package com.anushka.ems_test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EmsTestApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmsTestApplication.class, args);
	}

}
