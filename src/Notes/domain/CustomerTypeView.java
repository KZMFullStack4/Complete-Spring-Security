package ir.donyapardaz.niopdc.base.domain;

import ir.donyapardaz.niopdc.base.domain.enumeration.CustomerGroup;
import ir.donyapardaz.niopdc.base.domain.enumeration.LocationType;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseDataSource;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Objects;
import java.util.Set;

/**
 * A CustomerType.
 */
@Entity
@Table(name = "customer_type_view")
public class CustomerTypeView implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "username", length = 50, nullable = false)
    private String username;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        CustomerTypeView customerType = (CustomerTypeView) o;
        if (customerType.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), customerType.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

}
