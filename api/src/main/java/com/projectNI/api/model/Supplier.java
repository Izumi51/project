package com.projectNI.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;
import java.util.UUID;

@Table(name="supplier")
@Entity(name = "supplier")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "idSupplier")

public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idSupplier;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(nullable = false, unique = true)
    private String cnpj;

    @Column
    private String contactName;

    @Column
    private String phone;

    @Column
    private String email;

    @Enumerated(EnumType.STRING)
    @Column
    private SupplierStatus supplierStatus;

    /**
        The @OneToMany annotation defines the relationship.
        mappedBy = "supplier": This is crucial. It tells JPA that the 'supplier' field
        in the Product entity is the owner of this relationship.
        This prevents a second join table from being created.

        cascade = CascadeType.ALL: This means that persistence actions (save, update, delete)
        on a Supplier will cascade to its associated Products.
        For example, if you delete a supplier, all of its products
        will be deleted too. Use with caution.

        orphanRemoval = true: If you remove a product from the supplier's list of products
        (e.g., supplier.getProducts().remove(someProduct)), that
        product will be deleted from the database.
    */
    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Product> products;
}