package com.projectNI.api.controller;

import com.projectNI.api.service.BiddingService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/bidding")
public class BiddingController {
    private BiddingService biddingService;
}