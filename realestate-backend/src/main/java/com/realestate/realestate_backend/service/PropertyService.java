package com.realestate.realestate_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.realestate.realestate_backend.entity.PropertyEntity;
import com.realestate.realestate_backend.repository.PropertyRepository;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    // CREATE
    public PropertyEntity createProperty(PropertyEntity property) {
        return propertyRepository.save(property);
    }

    // READ ALL
    public List<PropertyEntity> getAllProperties() {
        return propertyRepository.findAll();
    }

    // READ BY ID
    public Optional<PropertyEntity> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    // UPDATE
    public PropertyEntity updateProperty(Long id, PropertyEntity property) {

        PropertyEntity existingProperty =
                propertyRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Property not found with id: " + id));

        existingProperty.setTitle(property.getTitle());
        existingProperty.setDescription(property.getDescription());
        existingProperty.setLocation(property.getLocation());
        existingProperty.setPrice(property.getPrice());
        existingProperty.setPropertyType(property.getPropertyType());
        existingProperty.setBedrooms(property.getBedrooms());
        existingProperty.setBathrooms(property.getBathrooms());
        existingProperty.setArea(property.getArea());
        existingProperty.setStatus(property.getStatus());

        return propertyRepository.save(existingProperty);
    }

    // DELETE
    public void deleteProperty(Long id) {

        if (!propertyRepository.existsById(id)) {
            throw new RuntimeException("Property not found with id: " + id);
        }

        propertyRepository.deleteById(id);
    }
}