package ir.donyapardaz.niopdc.base.repository;

import ir.donyapardaz.niopdc.base.domain.Person;
import ir.donyapardaz.niopdc.base.domain.PersonTransport;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


/**
 * Spring Data JPA repository for the CustomerScore entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface PersonTransportRepository extends JpaRepository<PersonTransport, Long> ,QueryDslPredicateExecutor<PersonTransport> {

    PersonTransport findOneByPerson(Person person);

    @Query("select pt from PersonTransport pt inner join fetch pt.person p where pt.code = :code")
    PersonTransport findOneByCode(@Param("code") String code);
}
