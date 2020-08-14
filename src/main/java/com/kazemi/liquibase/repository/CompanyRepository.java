package com.kazemi.liquibase.repository;

import com.kazemi.liquibase.model.CompanyModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository  extends JpaRepository<CompanyModel,Long> {
}
