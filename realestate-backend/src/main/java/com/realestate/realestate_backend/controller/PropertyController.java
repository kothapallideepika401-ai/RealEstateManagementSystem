package com.realestate.realestate_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.realestate.realestate_backend.entity.PropertyEntity;
import com.realestate.realestate_backend.service.PropertyService;

@RestController
@RequestMapping("/api/properties")

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "https://realestatemanagementsystem-beta.vercel.app"
})

public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    // CREATE PROPERTY
    @PostMapping
    public ResponseEntity<PropertyEntity> createProperty(
            @RequestBody PropertyEntity property) {

        PropertyEntity savedProperty =
                propertyService.createProperty(property);

        return new ResponseEntity<>(
                savedProperty,
                HttpStatus.CREATED
        );
    }

    // GET ALL PROPERTIES
    @GetMapping
    public ResponseEntity<List<PropertyEntity>> getAllProperties() {

        List<PropertyEntity> properties =
                propertyService.getAllProperties();

        return ResponseEntity.ok(properties);
    }

    // GET PROPERTY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<PropertyEntity> getPropertyById(
            @PathVariable Long id) {

        return propertyService
                .getPropertyById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // UPDATE PROPERTY
    @PutMapping("/{id}")
    public ResponseEntity<PropertyEntity> updateProperty(
            @PathVariable Long id,
            @RequestBody PropertyEntity property) {

        PropertyEntity updatedProperty =
                propertyService.updateProperty(
                        id,
                        property
                );

        return ResponseEntity.ok(updatedProperty);
    }

    // DELETE PROPERTY
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProperty(
            @PathVariable Long id) {

        propertyService.deleteProperty(id);

        return ResponseEntity.ok(
                "Property deleted successfully"
        );
    }
}