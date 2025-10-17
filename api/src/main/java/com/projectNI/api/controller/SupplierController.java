package com.projectNI.api.controller;

import com.projectNI.api.service.SupplierService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/supplier")
public class SupplierController {
    private SupplierService supplierService;
}