package com.realestate.realestate_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.realestate.realestate_backend.entity.PropertyEntity;

@Repository
public interface PropertyRepository extends JpaRepository<PropertyEntity, Long> {

}